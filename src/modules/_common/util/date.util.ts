const units = [
    { label: 'year', value: 525600 },
    { label: 'month', value: 43800 },
    { label: 'week', value: 10080 },
    { label: 'day', value: 1440 },
    { label: 'hour', value: 60 },
    { label: 'minute', value: 1 }
];

export const getIntervalAggregation = (minutes: number): string => {
    for (const unit of units) {
        if (minutes % unit.value === 0) {
            const amount = minutes / unit.value;
            return `${amount} ${unit.label}${amount > 1 ? 's' : ''}`;
        }
    }

    return `${minutes} minutes`;
}
