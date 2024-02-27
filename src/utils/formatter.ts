function useFormatter() {
    const getOnlyNumbers = (value: string): string => value.replace(/\D/g, "");

    return {
        getOnlyNumbers
    };
}

export default useFormatter;