// import React from "react"
// import ReactSlider from "react-slider"

// import FilterControl from "./FilterControl/FilterControl"
// import Label from "./Label"

// function Thumb(props) {
//   return (
//     <StyledThumb {...props} /> // eslint-disable-line react/jsx-props-no-spreading
//   )
// }

// function Track(props) {
//   return (
//     <StyledTrack {...props} /> // eslint-disable-line react/jsx-props-no-spreading
//   )
// }

// export default function RangeFilter({ label, min, max, handleChange }) {
//   const initialState = [min, max]

//   const [state, setState] = React.useState(initialState.slice())

//   const valuesAreValid = values => {
//     return (
//       values[0] < values[1] &&
//       values[0] >= initialState[0] &&
//       values[1] <= initialState[1]
//     )
//   }

//   const handleSliderUpdate = values => {
//     if (!Array.isArray(values)) {
//       return
//     }
//     handleChange(values)
//   }

//   const handleSliderChange = values => {
//     if (!Array.isArray(values)) {
//       return
//     }
//     setState([...values])
//   }

//   const handleMinChange = value => {
//     const newState = [parseInt(value, 10), state[1]]
//     setState(newState)

//     if (valuesAreValid(newState)) {
//       handleChange(newState)
//     }
//   }

//   const handleMaxChange = value => {
//     const newState = [state[0], parseInt(value, 10)]
//     setState(newState)

//     if (valuesAreValid(newState)) {
//       handleChange(newState)
//     }
//   }

//   return (
//     <FilterControl>
//       <Label htmlFor={label}>{label}</Label>
//       <RangeFilterWrap>
//         <StyledSlider
//           value={state}
//           max={max}
//           min={min}
//           renderTrack={Track}
//           renderThumb={Thumb}
//           onChange={handleSliderChange}
//           onAfterChange={handleSliderUpdate}
//           thumbActiveClassName="dragging"
//         />
//         <RangeInputMin
//           type="number"
//           value={state[0]}
//           min={min}
//           max={max}
//           step="1"
//           onChange={e => handleMinChange(e.target.value)}
//           className="filter-numeric min"
//         />
//         <RangeInputMax
//           type="number"
//           value={state[1]}
//           min={min}
//           max={max}
//           onChange={e => handleMaxChange(e.target.value)}
//           step="1"
//           className="filter-numeric max"
//         />
//       </RangeFilterWrap>
//     </FilterControl>
//   )
// }
