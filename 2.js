import React, { useState } from "react";
import toast from "react-toastify";

import ViewHolesTable from "./ViewHolesTable";
import TableReport from "../../../common/table/table";
import MessageEmptyData from "../../../common/messageEmptyData";
import ModalConfirmation from "../../../common/modal/ModalConfirmation";
import apiClient from "../../../../utils/apiClient";
import * as ArrayHelpers from "../../../../utils/arrayHelpers";

/**
 * Body report component for DirectEntry Report
 * @param prop
 * @returns {JSX.Element|null}
 * @constructor
 */

const ViewHolesBodys = (prop) => {
  const { filters, tableData, setTableData, selectedRow, setSelectedRow } =
    prop;
  const [deactivateModal, setDeactivateModal] = useState({
    isOpen: false,
    message: "",
  });
  const [approveModal, setApproveModal] = useState({
    isOpen: false,
    message: "",
  });

  const [disapproveModal, setDisapproveModal] = useState({
    isOpen: false,
    message: "",
  });

  const DeactivateHandler = async () => {
    try {
      const { data } = apiClient.post("deactivateDaily", {
        id: selectedRow.daily_id,
      });
      const newTableData = ArrayHelpers.removeDailyObjFromArray(
        tableData,
        "daily_id",
        data
      );
      setTableData(newTableData);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
    }
    setDeactivateModal({ ...deactivateModal, isOpen: false });
  };

  const ApproveHandler = async () => {
    try {
      const { data } = apiClient.post("approveDaily", {
        id: selectedRow.daily_id,
      });
      updateTableData(data);
    } catch (err) {
      console.log(err);
    }
    setApproveModal({ ...approveModal, isOpen: false });
  };

  const DisapproveHandler = async () => {
    try {
      const { data } = apiClient.post("disapproveDaily", {
        id: selectedRow.daily_id,
      });
      updateTableData(data);
    } catch (err) {
      console.log(err);
    }
    setDisapproveModal({ ...disapproveModal, isOpen: false });
  };

  const updateTableData = (data) => {
    const newTableData = ArrayHelpers.replaceDailyObjectsFromArray(
      tableData,
      "daily_id",
      Number(data.id),
      data.row
    );
    setTableData(newTableData);
    toast.success(data.message);
  };

  if (!filters.isSubmitted) {
    return null;
  }

  if (tableData.length === 0) {
    return <MessageEmptyData />;
  }

  return (
    <div className="container-fluid">
      <TableReport
        columns={ViewHolesTable(
          setSelectedRow,
          setApproveModal,
          setDisapproveModal,
          setDeactivateModal
        )}
        data={tableData}
        exportOptions={{ pdf: false, xlsx: true, csv: true }}
        getExportFileName={() => "active_dailies"}
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
