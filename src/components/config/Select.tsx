import React from "react"
import { makeStyles } from "@material-ui/styles"
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"
import { isMobile } from "react-device-detect"
import { NumDict } from "../../formation/interfaces"

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing.unit,
    minWidth: 180
  }
}))

function makeOpts(opts: number[], desc?: NumDict<string>) {
  return opts.map(opt =>
    isMobile ? (
      <option key={opt} value={opt}>
        {desc ? desc[opt] : opt}
      </option>
    ) : (
      <MenuItem key={opt} value={opt}>
        {desc ? desc[opt] : opt}
      </MenuItem>
    )
  )
}

type Props = {
  label: string;
  opts: number[];
  desc?: NumDict<string>;
  value: number;
  onSet: (value: number) => void;
}
export default (props: Props) => {
  const { label, value, onSet, opts, desc } = props
  const classes = useStyles()
  return (
    <FormControl className={classes.root}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={e => onSet(parseInt(e.target.value))}
        native={isMobile}
      >
        {makeOpts(opts, desc)}
      </Select>
    </FormControl>
  )
}
