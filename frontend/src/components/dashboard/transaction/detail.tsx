import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Tag } from "primereact/tag";
import { TransactionDetail } from "./table";
import { useRef } from "react";
import { Toast } from "primereact/toast";

interface TransactionDetailModalProps {
    transaction: TransactionDetail | null;
    visible: boolean;
    onHide: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
    transaction,
    visible,
    onHide
}) => {
    const toast = useRef<Toast>(null);
    
    if (!transaction) return null;
    // Format price as currency
    const formattedPrice = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB'
    }).format(transaction.price);

    // Format date
    const formattedDate = new Date(transaction.purchase_date).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Footer content for the dialog
    const footer = (
        <div className="flex justify-end">
            <Button
                label="Close"
                icon="pi pi-times"
                onClick={onHide}
                className="p-button-text"
            />
        </div>
    );
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.current?.show({
                severity: 'success',
                summary: 'Copied!',
                detail: `${label} copied to clipboard`,
                life: 3000
            });
        }).catch(err => {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to copy text',
                life: 3000
            });
            console.error('Could not copy text: ', err);
        });
    };

    const CopyableId = ({ id, label }: { id: string, label: string }) => (
        <div className="flex items-center gap-2">
            <span className="truncate max-w-xs" title={id}>{id}</span>
            <Button
                icon="pi pi-copy"
                className="p-button-rounded p-button-text p-button-sm"
                onClick={() => copyToClipboard(id, label)}
                tooltip="Copy ID"
                tooltipOptions={{ position: 'top' }}
            />
        </div>
    );

    return (
        <>
            <Toast ref={toast} />
            <Dialog
                header="Transaction Details"
                visible={visible}
                style={{ width: '550px' }}
                onHide={onHide}
                footer={footer}
                dismissableMask
                modal
            >
                <div className="grid grid-cols-1 gap-4">
                    {/* Transaction Status Banner */}
                    <div className={`p-4 rounded-lg flex justify-between items-center ${transaction.status === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                {transaction.status === 'SUCCESS' ? 'Transaction Successful' : 'Transaction Failed'}
                            </h3>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                                Transaction ID:
                                <CopyableId id={transaction.id} label="Transaction ID" />
                            </div>
                        </div>
                        <Tag
                            severity={transaction.status === 'SUCCESS' ? 'success' : 'danger'}
                            value={transaction.status}
                            className="text-sm"
                        />
                    </div>

                    {/* Transaction Details */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-3">Payment Details</h3>

                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="text-gray-600">Amount:</div>
                            <div className="font-medium">{formattedPrice}</div>

                            <div className="text-gray-600">Date:</div>
                            <div>{formattedDate}</div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-3">Customer Information</h3>

                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="text-gray-600">Name:</div>
                            <div>{transaction.user.name}</div>

                            <div className="text-gray-600">Email:</div>
                            <div>{transaction.user.email}</div>

                            <div className="text-gray-600">User ID:</div>
                            <CopyableId id={transaction.user_id} label="User ID" />
                        </div>
                    </div>

                    {/* Product Information */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-3">Product Information</h3>

                        <div className="grid grid-cols-2 gap-y-3">
                            <div className="text-gray-600">Cluster:</div>
                            <div>{transaction.version.cluster.name}</div>

                            <div className="text-gray-600">Version:</div>
                            <div>{transaction.version.version}</div>

                            <div className="text-gray-600">Version ID:</div>
                            <CopyableId id={transaction.version_id} label="Version ID" />
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default TransactionDetailModal