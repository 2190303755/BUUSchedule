const REGEX_TIME = /(\d+)[-,]?(\d*)[节周]/g;
const REGEX_SKIP = /\|[单双]周/;
const TIME_TABLE = [
    undefined, // 索引从0开始
    {"section": 1, "startTime": "08:00", "endTime": "08:45"},
    {"section": 2, "startTime": "08:50", "endTime": "09:35"},
    {"section": 3, "startTime": "09:55", "endTime": "10:40"},
    {"section": 4, "startTime": "10:45", "endTime": "11:30"},
    {"section": 5, "startTime": "11:35", "endTime": "12:20"},
    {"section": 6, "startTime": "13:00", "endTime": "13:45"},
    {"section": 7, "startTime": "13:50", "endTime": "14:35"},
    {"section": 8, "startTime": "14:50", "endTime": "15:35"},
    {"section": 9, "startTime": "15:40", "endTime": "16:25"},
    {"section": 10, "startTime": "16:40", "endTime": "17:25"},
    {"section": 11, "startTime": "17:30", "endTime": "18:15"},
    {"section": 12, "startTime": "18:20", "endTime": "19:05"},
    {"section": 13, "startTime": "19:10", "endTime": "19:55"}
];
const CHAR2DAY = {
    '一': 1,
    '二': 2,
    '三': 3,
    '四': 4,
    '五': 5,
    '六': 6,
    '日': 7
};

/**
 * 过滤掉奇数索引的项
 */
function biWeekly(_, i) {
    return (i & 1) === 0;
}

function notBlank(str) {
    return str?.replaceAll(/&nbsp;/g, '').trim();
}

function getSectionInfo(section) {
    return TIME_TABLE[section];
}

function parseTimeRanges(rawTime) {
    let match;
    const result = [];
    while ((match = REGEX_TIME.exec(rawTime)) !== null) {
        const range = [];
        const start = parseInt(match[1], 10);
        const end = match[2] === '' ? start : parseInt(match[2], 10);
        for (let i = start; i <= end; ++i) {
            range.push(i);
        }
        result.push(range);
    }
    return result;
}

function parseClass(info, index, fallback) {
    let weeks;
    let sections;
    const time = info[index + 1];
    const ranges = parseTimeRanges(
        time.replaceAll(/节\/周/g, '') // fallback的duration有时长了
    );
    switch (ranges.length) {
        case 1:
            weeks = ranges[0];
            sections = [];
            for (let i = 0; i < fallback.duration; ++i) {
                sections.push(fallback.section + i);
            }
            break;
        case 2:
            weeks = ranges[1];
            sections = ranges[0];
            break;
        default:
            throw SyntaxError(`Wrong Format: ${time}, ${ranges}`);
    }
    return {
        name: info[index],
        weeks: REGEX_SKIP.test(time) ? weeks.filter(biWeekly) : weeks,
        teacher: info[index + 2],
        position: info[index + 3],
        day: time.startsWith('周') ? CHAR2DAY[time.charAt(1)] ?? fallback.day : fallback.day,
        sections: sections.map(getSectionInfo)
    };
}

/**
 * 除函数名外都可编辑
 * 传入的参数为scheduleHtmlProvider函数获取到的html
 * 可使用正则匹配
 * 可使用解析dom匹配，工具内置了$，跟jquery使用方法一样，直接用就可以了，参考：https://juejin.im/post/5ea131f76fb9a03c8122d6b9
 */
function scheduleHtmlParser(html) {
    const $ = cheerio.load(html, {decodeEntities: false});
    const classes = [];
    const table = Array.from({length: 8}, () => [])
    $('tr').each(function (index) {
        // 第一行是星期几，第二行是早晨；自减后恰好表示第几节课
        if (--index < 1) return true;
        let day = 0;
        $(this).children('td').each(function (column) {
            switch (index) {
                case 1: // 早
                case 6: // 午
                case 10: // 晚
                    if (--column < 1) return true; // span特有的错位；有一列表示第几节
                    break;
                default:
                    if (column < 1) return true; // 有一列表示第几节
            }
            let sections;
            do {
                sections = table[++day];
            } while (sections[index]); // 问就是span干的
            const self = $(this);
            const span = self.attr('rowspan');
            const clazz = {
                day: day,
                section: index,
                duration: span ? parseInt(span, 10) : 1,
                info: self.html().split('<br>').filter(notBlank),
            };
            for (let i = 0; i < clazz.duration; ++i) {
                sections[index + i] = clazz;
            }
            if (clazz.info.length) {
                classes.push(clazz);
            }
            return true;
        });
        return true;
    });
    return classes.flatMap(clazz => {
        const sections = [];
        const info = clazz.info;
        for (let index = 0; index < info.length; index += 4) {
            sections.push(parseClass(info, index, clazz));
        }
        return sections;
    });
}