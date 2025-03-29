const checkSourceAvailability = async (source: string)=> {
    try {
        const response = await fetch(source, { method: "HEAD" });
        if (response.ok) {
            return true
        } else {
            return false
        }
    } catch (error: any) {
        return false
    }
}