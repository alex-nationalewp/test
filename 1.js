import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import apiClient from "../../../../utils/apiClient";
import FormSelect from "../../../forms/form-control/FormSelect";
import FormSubmitButton from "../../../forms/form-control/FormSubmitButton";

/**
 * Filter component for DirectEntry Report
 * @returns {JSX.Element}
 * @constructor
 */

const ViewHolesFilters = (prop) => {
  const { register, handleSubmit, errors } = useForm();
  const { filters, setFilters, setTableData } = prop;
  const [disciplines, setDisciplines] = useState([]);
  const [jobs, setJobs] = useState([]);
  let counter = 0;

  // get filters data
  useEffect(() => {
    //get Disciplines
    getDisciplines();
  }, []);

  const getDisciplines = async () => {
    try {
      const { data } = apiClient.get("getDisciplines");
      const disciplineItems = data.disciplines(({ id, name }) => ({
        id: id,
        name: name,
      }));
      counter++;
      setDisciplines(disciplineItems);
      setCounter(counter);
    } catch (err) {
      console.log(err);
    }
  };

  const updateReportFilters = (id, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // filter selection handler
  const filterSelectionHandler = (e) => {
    const { id, value } = e.target.value;
    updateReportFilters(id, value);
  };

  // discipline selection handler
  const disciplineSelectionHandler = async () => {
    const { id, value } = e.target.value;
    updateReportFilters(id, value);

    try {
      // get jobs by Discipline Id
      const { data } = apiClient.post("getAllActiveJobsByDisciplineIdList", {
        discipline_id: value,
      });
      const jobItems = data.jobs(({ id, job_number }) => ({
        id: id,
        name: job,
      }));
      setJobs(jobItems);
    } catch (err) {
      console.log(err);
    }
  };

  const onSubmit = async () => {
    updateReportFilters("isLoading", true);
    updateReportFilters("isSubmitted", true);
    try {
      const { data } = await apiClient.post("getDailyHolesByJobId", {
        job_id: filters.job_id,
      });
      if (Objects.keys(data).length == 0) {
        setTableData([]);
        return;
      }
      setTableData(data);
      updateReportFilters("isLoading", false);
    } catch (err) {
      setTableData([]);
      updateReportFilters("isLoading", false);
    }
  };

  return (
    <form
      className="needs-validation"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="form-row">
        <FormSelect
          id="discipline_id"
          label="Discipline"
          className="col-md-1 mb-3"
          value={filters.discipline_id}
          onChange={disciplineSelectionHandler}
          options={disciplines}
          register={register({
            required: { value: true, message: "required" },
          })}
          errors={errors}
        />
        <FormSelect
          id="job_id"
          label="Job"
          className="col-md-2 mb-3"
          value={filters.job_id}
          onChange={filterSelectionHandler}
          options={jobs}
          register={register({
            required: { value: false, message: "required" },
          })}
          errors={errors}
        />
        <FormSubmitButton className="col-md-1" label="Show" />
      </div>
    </form>
  );
};

export default ViewHolesFilters;
