async function scheduleHtmlProvider() {
    await loadTool('AIScheduleTools');
    const iframe = document.getElementById('iframeautoheight');
    if (iframe !== null) {
        const schedule = iframe.contentDocument.getElementsByClassName('schedule');
        if (schedule.length) {
            const result = schedule[0].outerHTML;//免得在弹弹窗之后被导航了
            await AIScheduleTools().AISchedulePrompt({
                titleText: '即将开始解析',
                tipText: '如遇到问题请复制并访问下方链接进行反馈',
                defaultText: 'https://github.com/2190303755/BUUSchedule/issues',
                validator: _ => false
            });
            return result;
        }
    }
    await AIScheduleTools().AISchedulePrompt({
        titleText: '位置异常',
        tipText: '请确认当前位于 查询→学生个人课表 再尝试；\n目前仅支持新学期课表。\n如遇到问题请复制并访问下方链接进行反馈',
        defaultText: 'https://github.com/2190303755/BUUSchedule/issues',
        validator: _ => false
    });
    return 'do not continue';
}