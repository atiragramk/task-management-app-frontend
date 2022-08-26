import React from "react";
import { useSelector } from "react-redux";
import { boardFilterParams, boardUsersSelector } from "../../selectors/board";

import AddIcon from "@mui/icons-material/Add";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SearchIcon from "@mui/icons-material/Search";
import {
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Stack,
  Autocomplete,
} from "@mui/material";

import { priorityList } from "../../constants";
import { Params, Status, User } from "../../../../types";
import { StyledButton, StyledFormControl } from "./styled";

type SortingBarProps = {
  data: Status[];
  onFilter: (params: Params) => void;
  onReset: () => void;
  onCreateModalOpen: () => void;
};

export const SortingBar: React.FC<SortingBarProps> = (props) => {
  const { data, onFilter, onCreateModalOpen, onReset } = props;
  const { loading, userList } = useSelector(boardUsersSelector);
  const params = useSelector(boardFilterParams);

  const handleAssigneeChange = (data: User[]) => {
    const assignee: string[] = [];
    data.forEach((user) => {
      assignee.push(user.email);
    });
    onFilter({ assignee });
    onFilter({ userData: data });
  };

  return (
    <Stack
      direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
      spacing={2}
      sx={{ pt: 2, pl: 1 }}
    >
      <StyledButton
        onClick={onCreateModalOpen}
        variant="contained"
        size="small"
        startIcon={<AddIcon />}
      >
        Add issue
      </StyledButton>
      <TextField
        size="small"
        onChange={(event) => onFilter({ search: event.target.value })}
        placeholder="Search this board"
        variant="outlined"
        value={params.search}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      ></TextField>
      <StyledFormControl size="small">
        <InputLabel id="status-select-label">Status</InputLabel>
        <Select
          labelId="status-select-label"
          id="status-select"
          label="Status"
          value={params.status}
          onChange={(event) => onFilter({ status: event.target.value })}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.map((status) => {
            return (
              <MenuItem key={status._id} value={status.key}>
                {status.displayName}
              </MenuItem>
            );
          })}
        </Select>
      </StyledFormControl>
      <StyledFormControl size="small">
        <InputLabel id="priority-select-label">Priority</InputLabel>
        <Select
          labelId="priority-select-label"
          id="priority-select"
          value={params.priority}
          label="Priority"
          onChange={(event) => onFilter({ priority: event.target.value })}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {priorityList.map((priority, index) => {
            return (
              <MenuItem key={index} value={priority.toLowerCase()}>
                {priority}
              </MenuItem>
            );
          })}
        </Select>
      </StyledFormControl>
      <Autocomplete
        sx={{ maxWidth: 450, mt: 1, minWidth: 350 }}
        size="small"
        multiple
        loading={loading}
        id="users"
        options={userList}
        filterSelectedOptions
        disableCloseOnSelect
        value={params.userData}
        onChange={(_, data) => handleAssigneeChange(data)}
        getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
        renderInput={(params) => (
          <TextField {...params} label="Assignee" placeholder="User" />
        )}
      ></Autocomplete>
      <StyledButton
        size="small"
        variant="outlined"
        onClick={onReset}
        startIcon={<FilterAltOffIcon />}
      >
        Clear All
      </StyledButton>
    </Stack>
  );
};
