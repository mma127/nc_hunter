import {Box, Button, Dialog, DialogTitle, TextField} from "@mui/material";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {TrackingResult} from "../models/TrackingResult";
import {addResult} from "../state/gridActions";
import {useGrid, useGridDispatch} from "../GridContext";
import useClasses from "../hooks/useClasses";
import {maybeFetchAdditionalCharacters, parseNames} from "../state/characters";

const styles = () => ({
  formWrapper: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
    paddingBottom: '0.5rem'
  },
  row: {
    display: 'flex',
    justifyContent: "center",
    marginBottom: "0.5rem"
  },
  namesInput: {
    width: "24rem"
  }
})

const schema = yup.object().shape({
  revealed: yup.string()
})

export const TrackingDialog = ({open, onClose}) => {
  const classes = useClasses(styles);
  const grid = useGrid()
  const dispatch = useGridDispatch()

  const currentX = grid.currentX;
  const currentY = grid.currentY;
  const charactersByName = grid.charactersByName;

  const {handleSubmit, control, formState: {errors}} = useForm({
    resolver: yupResolver(schema),
  })

  const handleClose = () => {
    onClose()
  }

  const onSubmit = async data => {
    const parsedNames = parseNames(data.revealed);
    const characters = await maybeFetchAdditionalCharacters(parsedNames, charactersByName);
    const trackingResult = new TrackingResult(grid.currentX, grid.currentY, characters)
    dispatch(addResult(grid.tiles, trackingResult, charactersByName))
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>New Tracker Result at [{currentX}, {currentY}]</DialogTitle>
      <Box className={classes.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
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
      </Box>
    </Dialog>
  )
}
