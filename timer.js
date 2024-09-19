/**
 * 时间配置函数，此为入口函数，不要改动函数名
 */
async function scheduleTimer() {
    // 内嵌loadTool工具，传入工具名即可引用公共工具函数(暂未确定公共函数，后续会开放)
    await loadTool('AIScheduleTools');
    const {AIScheduleAlert} = AIScheduleTools();
    // 只要大声喊出 liuwenkiii yyds 就可以保你代码不出bug
    /* \ liuwenkiii yyds! / */
    /* 支持异步操作 推荐await写法
    const someAsyncFunc = () => new Promise(resolve => {
      setTimeout(() => resolve(), 100)
    })
    await someAsyncFunc()*/
    await AIScheduleAlert('解析成功!\n如有问题可联系Q 2190303755');
    // 返回时间配置JSON，所有项都为可选项，如果不进行时间配置，请返回空对象
    return {
        totalWeek: 18, // 总周数：[1, 30]之间的整数
        startSemester: '', // 开学时间：时间戳，13位长度字符串，推荐用代码生成
        startWithSunday: false, // 是否是周日为起始日，该选项为true时，会开启显示周末选项
        showWeekend: false, // 是否显示周末
        forenoon: 5, // 上午课程节数：[1, 10]之间的整数
        afternoon: 4, // 下午课程节数：[0, 10]之间的整数
        night: 4, // 晚间课程节数：[0, 10]之间的整数
        sections: [
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
        ] // 课程时间表，注意：总长度要和上边配置的节数加和对齐
    };
}