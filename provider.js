async function scheduleHtmlProvider() {
    const schedule = document.getElementById('iframeautoheight').contentDocument.getElementsByClassName('schedule');
    if (schedule.length) return schedule[0].outerHTML;
    await loadTool('AIScheduleTools');
    const {AIScheduleAlert} = AIScheduleTools();
    await AIScheduleAlert('请确认当前位于查询→学生个人课表页再尝试；目前仅支持新学期课表。\n如有问题可联系Q 2190303755');
    return 'do not continue';
}
