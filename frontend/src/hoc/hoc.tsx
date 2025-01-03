const hoc = (WrappedComponent: React.FC<any>) => {
    return(props: any) => {
        return (
            <>
                <div className="flex">
                    <div className="w-full">
                        <WrappedComponent {...props} />
                    </div>
                </div>
            </>
        )
    }
}

export default hoc