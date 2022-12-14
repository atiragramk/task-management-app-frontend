import { useState } from "react";
import { Link } from "react-router-dom";

import { Stack } from "@mui/system";
import LogoutIcon from "@mui/icons-material/Logout";
import { Typography, IconButton, Box, Popover, Button } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import {
  StyledImage,
  StyledNavLink,
  StyledLink,
  StyledAppBar,
  StyledToolbar,
  StyledAvatar,
  StyledSpan,
} from "./styled";
import logo from "../../assets/img/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { authRemoveTokenAction } from "../../pages/Auth/reducer/auth";
import { authStateSelector } from "../../pages/Auth/selectors/auth";

export const Header = () => {
  const [anchorNavEl, setAnchorNavEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [anchorAvatarEl, setAnchorAvatarEl] = useState<HTMLDivElement | null>(
    null
  );
  const dispatch: AppDispatch = useDispatch();
  const token = localStorage.getItem("token");
  const { firstName } = useSelector(authStateSelector);

  const handleOpenPopover = (event: React.BaseSyntheticEvent, type: string) => {
    console.log(event);
    if (type === "avatar") {
      setAnchorAvatarEl(event.currentTarget);
    } else {
      setAnchorNavEl(event.currentTarget);
    }
  };

  const handleClosePopover = (type: string) => {
    if (type === "avatar") {
      setAnchorAvatarEl(null);
    } else {
      setAnchorNavEl(null);
    }
  };

  const handleSignOut = () => {
    dispatch(authRemoveTokenAction());
  };

  const openNav = Boolean(anchorNavEl);
  const openAvatar = Boolean(anchorAvatarEl);

  const id = openNav || openAvatar ? "simple-popover" : undefined;

  return (
    <>
      <StyledAppBar position="sticky">
        <StyledToolbar>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <StyledLink to="/">
              <StyledImage src={logo} alt="logo" />
            </StyledLink>
            <Typography variant="h6">
              Just <StyledSpan>TODO</StyledSpan> it
            </Typography>
            <Stack sx={{ ml: 2 }} direction="row">
              <StyledNavLink to="/">HOME</StyledNavLink>
              <Stack direction="row">
                <StyledNavLink to="/projects">PROJECTS</StyledNavLink>
                <IconButton
                  onClick={(e) => handleOpenPopover(e, "navigation")}
                  sx={{ p: 0 }}
                  color="primary"
                >
                  <ArrowDropDownIcon />
                </IconButton>

                <Popover
                  open={openNav}
                  id={id}
                  anchorEl={anchorNavEl}
                  onClose={() => handleClosePopover("projects")}
                  anchorOrigin={{
                    vertical: 40,
                    horizontal: -10,
                  }}
                >
                  <Stack>
                    <Button
                      onClick={() => handleClosePopover("projects")}
                      component={Link}
                      size="small"
                      color="info"
                      to="/projects"
                    >
                      View all projects
                    </Button>
                  </Stack>
                </Popover>
              </Stack>
            </Stack>
          </Box>
          {token && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography display="inline">
                Hello,{" "}
                <Typography color="primary" display="inline" variant="button">
                  {firstName}
                </Typography>
              </Typography>
              <IconButton>
                <StyledAvatar onClick={(e) => handleOpenPopover(e, "avatar")} />
                <Popover
                  open={openAvatar}
                  id={id}
                  anchorEl={anchorAvatarEl}
                  onClose={() => handleClosePopover("avatar")}
                  anchorOrigin={{
                    vertical: 40,
                    horizontal: -10,
                  }}
                >
                  <Stack>
                    <Button
                      onClick={() => {
                        handleClosePopover("avatar");
                        handleSignOut();
                      }}
                      endIcon={<LogoutIcon />}
                      size="small"
                      color="info"
                    >
                      Sign out
                    </Button>
                  </Stack>
                </Popover>
              </IconButton>
            </Box>
          )}
        </StyledToolbar>
      </StyledAppBar>
    </>
  );
};
