import {Box, Button, Card, Container, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material"
import {Controller, useForm} from "react-hook-form"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup";

import {useGridDispatch} from "../GridContext"
import {makeStyles} from "@mui/styles";
import {TrackingResult} from "../models/TrackingResult";
import {addInitialResult, selectPlane} from "../state/gridActions";

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    display: 'flex',
    justifyContent: "center"
  },
  coordWrapper: {
    margin: "0.5rem"
  },
  namesInput: {
    width: "26rem"
  }
}))

const schema = yup.object().shape({
  x: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  y: yup.number().typeError("Must be a number").required("Required").positive().integer().max(100),
  revealed: yup.string()
})

export const StartForm = () => {
  const classes = useStyles();
  const dispatch = useGridDispatch()

  const {handleSubmit, control, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = data => {
    const parsedNames = data.revealed.split(',').map(str => str.trim());
    const trackingResult = new TrackingResult(data.x, data.y, parsedNames)
    dispatch(selectPlane(data.plane))
    dispatch(addInitialResult(trackingResult))
  }

  return (
    <Container maxWidth="md">
      <Box className={classes.container}>
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={classes.row}>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="x" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting X coordinate"
                    error={Boolean(errors.x)}
                    helperText={errors.x?.message}
                    {...field}
                  />)}
                />
              </Box>
              <Box className={classes.coordWrapper}>
                <Controller
                  name="y" control={control} defaultValue=""
                  render={({field}) => (<TextField
                    variant="standard"
                    label="Starting Y coordinate"
                    error={Boolean(errors.y)}
                    helperText={errors.y?.message}
                    {...field}
                  />)}
                />
              </Box>
            </Box>
            <Box className={classes.row} pt={1} pb={1}>
              <Controller
                name="plane" control={control} defaultValue="generic"
                render={({ field }) => (
                  <FormControl sx={{ minWidth: 150 }} size="small">
                    <InputLabel id="plane-select-label">Select Plane</InputLabel>
                    <Select
                      labelId="plane-select"
                      id="plane-select"
                      label="Select Plane"
                      color="secondary"
                      {...field}
                    >
                      <MenuItem key="generic" value="generic">Generic</MenuItem>
                      <MenuItem key="elysium" value="elysium">Elysium</MenuItem>
                    </Select>
                  </FormControl>)}
              />
            </Box>
            <Box className={classes.row}>
              <Controller
                name="revealed" control={control} defaultValue=""
                render={({field}) => (<TextField
                  variant="standard"
                  label="Revealed names, comma separated"
                  error={Boolean(errors.revealed)}
                  helperText={errors.revealed?.message}
                  className={classes.namesInput}
                  {...field}
                />)}
              />
            </Box>
            <Button type="submit">Submit</Button>
          </form>
        </Card>
      </Box>
    </Container>
  )
}
