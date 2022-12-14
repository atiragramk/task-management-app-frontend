import React, { ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { StyledForm } from "./styled";
import { Status, Task } from "../../../../types";
import { useSelector } from "react-redux";
import { boardUsersSelector } from "../../selectors/board";
import { createTaskSchema } from "./validation";
import { priorityList } from "../../constants";

type TaskFormProp = {
  statusList: Status[];
  name: string;
  onConfirm: (values: Partial<Task>) => void;
  taskData?: Partial<Task>;
  loading: boolean;
};

export const TaskForm: React.FC<TaskFormProp> = (props) => {
  const { statusList, name, onConfirm, taskData, loading } = props;
  const { userList } = useSelector(boardUsersSelector);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createTaskSchema),
  });

  const filteredList = () => {
    if (taskData?.assignee?.length) {
      const assignee = [...taskData.assignee];
      return userList.filter((item) => {
        return assignee.every((filter) => {
          return filter._id !== item._id;
        });
      });
    }
    return userList;
  };
  const assigneeList = filteredList();

  const onSubmit = async (values: Partial<Task>) => {
    try {
      if (!taskData) {
        onConfirm(values);
      } else {
        onConfirm({ ...values, _id: taskData._id });
      }
    } catch (error) {}
  };

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)} id={name}>
      <FormControl required error={Boolean(errors.title)}>
        <FormLabel>Task Title</FormLabel>
        <Controller
          name="title"
          control={control}
          defaultValue={taskData?.title || ""}
          render={({ field }) => (
            <TextField
              error={Boolean(errors.title)}
              disabled={loading}
              helperText={errors.title?.message as ReactNode}
              size="small"
              {...field}
            />
          )}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Task Description</FormLabel>
        <Controller
          name="description"
          control={control}
          defaultValue={taskData?.description || ""}
          render={({ field }) => (
            <TextField
              multiline={true}
              rows={5}
              disabled={loading}
              error={Boolean(errors.description)}
              helperText={errors.description?.message as ReactNode}
              {...field}
            />
          )}
        />
      </FormControl>

      <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
        <FormControl
          error={Boolean(errors.statusId)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <InputLabel id="status">Status</InputLabel>
          <Controller
            name="statusId"
            control={control}
            defaultValue={taskData?.statusId || ""}
            render={({ field }) => (
              <Select
                {...field}
                labelId="status"
                id="status-select"
                disabled={loading}
                label="Status"
              >
                {statusList.map((status) => {
                  return (
                    <MenuItem key={status.key} value={status.key}>
                      {status.displayName}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          />
          <FormHelperText>
            {errors.statusId?.message as ReactNode}
          </FormHelperText>
        </FormControl>
        <FormControl
          error={Boolean(errors.priority)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <InputLabel id="priority-select-label">Priority</InputLabel>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                disabled={loading}
                labelId="priority-select-label"
                id="priority-select"
                label="Priority"
              >
                {priorityList.map((priority) => {
                  return (
                    <MenuItem key={priority} value={priority.toLowerCase()}>
                      {priority}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
            defaultValue={taskData?.priority || ""}
          />
          <FormHelperText>
            {errors.priority?.message as ReactNode}
          </FormHelperText>
        </FormControl>
        {errors.status && (
          <Typography>{errors.status.message as ReactNode}</Typography>
        )}
      </Stack>
      <FormControl>
        <Controller
          name="assignee"
          control={control}
          defaultValue={taskData?.assignee}
          render={({ field: { onChange, value } }) => (
            <Autocomplete
              sx={{ maxWidth: 535, mt: 1 }}
              size="small"
              multiple
              id="users"
              value={value}
              options={assigneeList}
              disabled={loading}
              filterSelectedOptions
              disableCloseOnSelect
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              renderInput={(params) => (
                <TextField {...params} label="Assignee" placeholder="User" />
              )}
              onChange={(_, data) => {
                onChange(data);
                return data;
              }}
            ></Autocomplete>
          )}
        />
      </FormControl>
    </StyledForm>
  );
};
