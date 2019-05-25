import AppBar from "@material-ui/core/AppBar"
import Drawer from "@material-ui/core/Drawer"
import Hidden from "@material-ui/core/Hidden"
import IconButton from "@material-ui/core/IconButton"
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import MenuIcon from "@material-ui/icons/Menu"
import RefreshIcon from "@material-ui/icons/Refresh"

import { makeStyles } from "@material-ui/styles"
import React from "react"
import Panels from "./Panels"
import { RefreshStateAction } from "../../store/types"
import { Dispatch } from "redux"
import { refreshState } from "../../store/actions"
import { connect } from "react-redux"

const drawerWidth = 280

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    height: "100vh"
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  menuButton: {
    marginRight: 20,
    [theme.breakpoints.up("sm")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  heading: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column"
  }
}))

interface ConfigDrawerProps {
  contents?: React.ReactNode
  children?: React.ReactNode
  onRefreshState: () => void
}
const ConfigDrawer: React.FunctionComponent<ConfigDrawerProps> = (
  props: ConfigDrawerProps
) => {
  const classes = useStyles()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.heading}
          >
            Formations
          </Typography>
          <IconButton color="inherit" onClick={props.onRefreshState}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <SwipeableDrawer
            variant="temporary"
            open={mobileOpen}
            onOpen={handleDrawerToggle}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            <div className={classes.toolbar} />
            <Panels />
          </SwipeableDrawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar} />
            <div />
            <Panels />
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {props.children}
      </main>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<RefreshStateAction>) => ({
  onRefreshState: () => dispatch(refreshState())
})

export default connect(
  null,
  mapDispatchToProps
)(ConfigDrawer)
