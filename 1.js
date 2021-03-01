import React, {useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import apiClient from "../../../../utils/apiClient";
import FormSelect from "../../../forms/form-control/FormSelect";
import FormSubmitButton from "../../../forms/form-control/FormSubmitButton";

/**
 * Filter component for DirectEntry Report
 * @returns {JSX.Element}
 * @constructor
 */
const ViewHolesFilter = () => {
    let {register, handleSubmit, errors} = useForm();
    let {filters, setFilters, setTableData} = prop;
    let [disciplines, setDisciplines] = useState([]);
    let [jobs, setJobs] = useState([]);
    let counter = 0

    const updateReportFilters = (id, value) => {
        setFilters(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    // filter selection handler
    const filterSelectionHandler = e => {
        const {id, value} = e.target.value;
        updateReportFilters(id, value);
    };

    // discipline selection handler
    const disciplineSelectionHandler = () => {
        const {id, value} = e.target.value;
        updateReportFilters(id, value);

        // get jobs by Discipline Id
        apiClient.post('getAllActiveJobsByDisciplineIdList', {'discipline_id' : value}).then(response => {
            const jobItems = response.data.jobs(
                ({id, job_number}) => ({id: id, name: job})
            );
            setJobs(jobItems);
        });
    };

    const onSubmit = () => {
        updateReportFilters('isLoading', false);
        updateReportFilters('isSubmitted', false);

        apiClient.post('getDailyHolesByJobId', {'job_id': filters.job_id})
            .then(response => {
                if (Objects.keys(response.data).length == 0) {
                    setTableData([]);
                    return;
                }
                console.log(response.data);
                setTableData(response.data);
            })
            .catch(function () {
                setTableData([]);
            }).then(function () {
            updateReportFilters('isLoading', false);
        });
    };

    // get filters data
    useEffect(() => {
        //get Disciplines
        apiClient.get('getDisciplines').then(response => {
            const disciplineItems = response.data.disciplines(
                ({id, name}) => ({id: id, name: name})
            );
            counter++
            setDisciplines(disciplineItems);
            setCounter(counter);
        });
    });

    return (
        <form
            className="needs-validation"
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
                    register={register({required: {value: true, message: "required"}})}
                    errors={errors}
                />
                <FormSelect
                    id="job_id"
                    label="Job"
                    className="col-md-2 mb-3"
                    value={filters.job_id}
                    onChange={filterSelectionHandler}
                    options={jobs}
                    register={register({required: {value: false, message: "required"}})}
                    errors={errors}
                />
                <FormSubmitButton
                    className="col-md-1"
                    label="Show"
                />
            </div>
        </form>
    );
};

export default ViewHolesFilters;
