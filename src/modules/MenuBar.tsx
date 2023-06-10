import {
  AppBar,
  Box,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  SvgIcon,
  Toolbar,
  Typography,
  IconButton,
  Link,
} from "@material-ui/core";
import { Build, Dashboard, Equalizer, Menu } from "@material-ui/icons";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Chevron } from "../icons/Chevron";
import { GentexLogo } from "../icons/GentexLogo";
import { GentexBlue } from "../styles/theme";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    color: "#FFF",
    backgroundColor: GentexBlue,
    zIndex: 999,
  },
  appBarStyle: {
    zIndex: 999,
    height: "48px",
    justifyContent: "center",
  },
  menuButton: {
    marginRight: 1,
  },
  title: {
    flexGrow: 1,
    textAlign: "left",
  },
  logo: {
    fontSize: 150,
    marginLeft: "8px",
    marginRight: "8px",
  },
  separator: {
    fontSize: 20,
    marginLeft: "14px",
    marginRight: "14px",
  },
  menuPanel: {
    backgroundColor: GentexBlue,
    width: "200px",
    height: "100%",
    color: "#FFF",
  },
}));

function HomeIcon(props: any) {
  return (
    <SvgIcon {...props}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

export const MenuBar: React.FC<{}> = (props) => {
  const classes = useStyles();

  const navigate = useNavigate();

  const handleMenuClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar
        position="static"
        color="transparent"
        className={classes.appBarStyle}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={handleMenuClick}
          >
            <Menu />
          </IconButton>
          <div
            style={{
              marginTop: "-50px",
              marginBottom: "-53px",
            }}
          >
            <GentexLogo className={classes.logo} data-testid="gentexLogo" />
          </div>
          <Chevron className={classes.separator} data-testid="logoSeparator" />
          <Typography
            variant="body1"
            className={classes.title}
            component={"span"}
          >
            <Box
              fontWeight="normal"
              fontSize="18px"
              style={{ cursor: "default", userSelect: "none" }}
            >
              {"FIRE PROTECTION 311T🔥"}
            </Box>
          </Typography>
          <div style={{ marginTop: "-4px" }}>
            <Link
              href="/"
              style={{ fontSize: "16px", color: "#FFF", marginRight: "30px" }}
            >
              Home
            </Link>
            <Link
              href="Stats"
              style={{ fontSize: "16px", color: "#FFF", marginRight: "30px" }}
            >
              Statistics
            </Link>
            <Link
              href="Dashboard"
              style={{ fontSize: "16px", color: "#FFF", marginRight: "30px" }}
            >
              Dashboard
            </Link>
            <Link
              href="Resources"
              style={{ fontSize: "16px", color: "#FFF", marginRight: "30px" }}
            >
              Resources
            </Link>
            <Link
              href="About"
              style={{ fontSize: "16px", color: "#FFF", marginRight: "30px" }}
            >
              About
            </Link>
          </div>
        </Toolbar>
        <Popover
          open={open}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 48, left: 0 }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={{ marginLeft: "-16px" }}
          onClose={handlePopoverClose}
        >
          <Paper className={classes.menuPanel}>
            <MenuList>
              <MenuItem
                style={{ marginBottom: "10px" }}
                onClick={(event) => {
                  navigate("/");
                }}
              >
                <HomeIcon style={{ color: "#FFF" }} />
                <Typography
                  variant="body1"
                  className={classes.title}
                  component={"span"}
                >
                  <Box
                    style={{
                      paddingTop: "2px",
                      paddingLeft: "6px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Home Page
                  </Box>
                </Typography>
              </MenuItem>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    borderTop: "2px solid rgba(255, 255, 255, 1)",
                    paddingBottom: "10px",
                    width: "180px",
                  }}
                />
              </div>
              <MenuItem
                onClick={(event) => {
                  navigate("/Stats");
                }}
              >
                <Equalizer style={{ color: "#FFF" }} />
                <Typography
                  variant="body1"
                  className={classes.title}
                  component={"span"}
                >
                  <Box
                    style={{
                      paddingTop: "2px",
                      paddingLeft: "6px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Stats
                  </Box>
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  navigate("/Dashboard");
                }}
              >
                <Dashboard style={{ color: "#FFF" }} />
                <Typography
                  variant="body1"
                  className={classes.title}
                  component={"span"}
                >
                  <Box
                    style={{
                      paddingTop: "2px",
                      paddingLeft: "6px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Dashboard
                  </Box>
                </Typography>
              </MenuItem>
              <MenuItem
                onClick={(event) => {
                  navigate("/Resources");
                }}
              >
                <Build style={{ color: "#FFF" }} />
                <Typography
                  variant="body1"
                  className={classes.title}
                  component={"span"}
                >
                  <Box
                    style={{
                      paddingTop: "2px",
                      paddingLeft: "6px",
                      fontWeight: "bold",
                      fontSize: "18px",
                    }}
                  >
                    Resources
                  </Box>
                </Typography>
              </MenuItem>
              <div style={{ height: "20px" }} />
            </MenuList>
          </Paper>
        </Popover>
      </AppBar>
    </div>
  );
};
