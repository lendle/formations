import React from "react"
import { makeStyles } from "@material-ui/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Collapse from "@material-ui/core/Collapse"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
}))

interface Props {
  icon: React.ReactElement
  primary: React.ReactNode
}

const NestedList: React.FunctionComponent<Props> = props => {
  const classes = useStyles()
  const [open, setOpen] = React.useState(false)

  function handleClick() {
    setOpen(!open)
  }

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <ListItemIcon>{props.icon}</ListItemIcon>
        <ListItemText inset primary={props.primary} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List disablePadding>
          {/* <ListItem button className={classes.nested}> */}
          {/* {props.children} */}
          {React.Children.toArray(props.children).map(element =>
            React.cloneElement(element as any, {
              className: classes.nested
            })
          )}

          {/* <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText inset primary="Starred" /> */}
          {/* </ListItem> */}
        </List>
      </Collapse>
    </React.Fragment>
  )
}

export default NestedList
