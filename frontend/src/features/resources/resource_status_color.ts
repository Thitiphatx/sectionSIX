import { ResourceStatus } from "@prisma/client"

export const resourceStatusColor = (status: ResourceStatus) => {
    switch (status) {
        case "PENDING":
            return "warning"
        case "READY":
            return "success"
        case "DONE":
            return "info"
    };
}