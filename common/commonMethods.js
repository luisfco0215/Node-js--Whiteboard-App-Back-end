
export const notEntityFoud = (entityName) => {
    return `Not ${entityName} found by the given ID.`
}

export const getDaysBetween = (startDate, endDate = new Date()) => {
    const msPerDay = 1000 * 60 * 60 * 24;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.floor((end - start) / msPerDay);
}