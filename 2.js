import React, {useState} from 'react';
import TableReport from "../../../common/table/table";
import ViewHolesTable from "./ViewHolesTable.js";
import MessageEmptyData from "../../../common/messageEmptyData";
import ModalConfirmation from "../../../common/modal/ModalConfirmation";
import apiClient from "../../../../utils/apiClient";
import toast from "react-toastify";
import * as ArrayHelpers from "../../../../utils/arrayHelpers";

/**
 * Body report component for DirectEntry Report
 * @param prop
 * @returns {JSX.Element|null}
 * @constructor
 */
const ViewHolesBody = prop => {
    let {filters, tableData, setTableData, selectedRow, setSelectedRow} = prop;
    let [deactivateModal, setDeactivateModal] = useState({isOpen: false, message: <p></p>});
    let [approveModal, setApproveModal] = useState({isOpen: false, message: <p></p>});
    let [disaproveModal, setDisaproveModal] = useState({isOpen: false, message: <p></p>});

    const DeactivateHandler = () => {
        apiClient.post('deactivateDaily', {'id': selectedRow.daily_id})
            .then(response => {
                cost newTableData = ArrayHelpers.removeDailyObjFromArray(tableData, "daily_id", response.data)
                setTableData(newTableData);
                toast.success(response.data.message);
            })
            .catch(function () {
                //In case of error do nothing!!
                //let apiClient to handle the error
            })
            .then(function () {
                //close deactivateModal
                setDeactivateModal({...deactivateModal, isOpen: false})
            });
    }

    const ApproveHandler = () => {
        apiClient.post('approveDaily', {'id': selectedRow.daily_id})
            .then(response => {
                const newTableData = ArrayHelpers.replaceDailyObjectsFromArray(tableData, "daily_id", response.data.id, response.data.row);
                setTableData(newTableData);
                toast.success(response.data.message);
            })
            .catch(function () {
                //In case of error do nothing!!
                //let apiClient to handle the error
            })
            .then(function () {
                //close deactivateModal
                setApproveModal({...approveModal, isOpen: false})
            });
    }

    const DisapproveHandler = () => {
        apiClient.post('disapproveDaily', {'id': selectedRow.daily_id})
            .then(response => {
                const newTableData = ArrayHelpers.replaceDailyObjectsFromArray(tableData, "daily_id", Number(response.data.id), response.data.row);
                setTableData(newTableData);
                toast.success(response.data.message);
            })
            .catch(function () {
                //In case of error do nothing!!
                //let apiClient to handle the error
            })
            .then(function () {
                //close deactivateModal
                setDisapproveModal({...disapproveModal, isOpen: false})
            });
    }

    if (!filters.isSubmitted) {
        return null;
    }

    if (tableData.length == 0) {
        return <MessageEmptyData/>;
    }

    return (
        <div className="container-fluid">
            <TableReport
                columns={ViewHolesTabl(setSelectedRow, setApproveModal, setDisapproveModal, setDeactivateModal)}
                data={tableData}
                exportOptions={{pdf: false, xlsx: true, csv: true}}
                getExportFileName={() => 'active_dailies'}
                withGlobalSearch={true}
            />
            <ModalConfirmation
                modal={deactivateModal}
                setModal={setDeactivateModal}
                title="Deactivate Daily"
                onConfirm={DeactivateHandler}
            />
            <ModalConfirmation
                modal={approveModal}
                setModal={setApproveModal}
                title="Approve Daily"
                onConfirm={ApproveHandler}
            />
            <ModalConfirmation
                modal={disapproveModal}
                setModal={setDisapproveModal}
                title="Disapprove Daily"
                onConfirm={DisapproveHandler}
            />
        </div>
    );
};

export default ViewHolesBodys;
