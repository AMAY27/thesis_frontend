
export interface AlertProps {
    user_id: string;
    title: string;
    classname: string;
    alert_type: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    createdAt: string;
}

export interface AlertUpdateProps extends AlertProps {
    _id: string
}

export interface AlertCalendarProps {
    user_id: string;
    title: string;
    classname: string;
    alert_type: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
    createdAt: string;
    handleAlertCalendarClicked: () => void;
}

export interface AddAlertProps {
    user_id: string;
    title: string;
    classname: string;
    alert_type: string;
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
    status: string;
}

export interface AlertLogsProps {
    _id: string;
    alertId: string;
    userId: string;
    triggerDate: string;
    alertTitle: string;
    alertClass: string
}