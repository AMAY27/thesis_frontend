type timeRange = {
    start_time: string;
    end_time: string;
}

type dateRange = {
    start_date: string;
    end_date: string;
}

export default interface AlertProps {
    status: string;
    title: string;
    classname: string;
    alertType: string;
    time_range: timeRange;
    date_range: dateRange;
    createdAt: string;
}