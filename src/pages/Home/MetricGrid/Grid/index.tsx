import { MeasuringStrategy } from '@dnd-kit/core'
import {
  arraySwap,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
  rectSortingStrategy,
  rectSwappingStrategy,
} from '@dnd-kit/sortable'
import React from 'react'

import { Sortable, Props as SortableProps } from './Sortable'
import { GridContainer } from './components'

const defProps: Partial<SortableProps> = {
  adjustScale: true,
  Container: (props: any) => <GridContainer {...props} columns={5} />,
  strategy: rectSortingStrategy,
  wrapperStyle: () => ({
    // width: 140,
    // height: 140,
  }),
}

// export const BasicSetup = () => <Sortable {...props} />

// export const WithoutDragOverlay = () => (
//   <Sortable {...props} useDragOverlay={false} />
// )

// export const LargeFirstTile = () => (
//   <Sortable
//     {...props}
//     getItemStyles={({ index }) => {
//       if (index === 0) {
//         return {
//           fontSize: '2rem',
//           padding: '36px 40px',
//         }
//       }

//       return {}
//     }}
//     wrapperStyle={({ index }) => {
//       if (index === 0) {
//         return {
//           height: 288,
//           gridRowStart: 'span 2',
//           gridColumnStart: 'span 2',
//         }
//       }

//       return {
//         width: 140,
//         height: 140,
//       }
//     }}
//   />
// )

// export const VariableSizes = () => (
//   <Sortable
//     {...props}
//     itemCount={14}
//     getItemStyles={({ index }) => {
//       if (index === 0 || index === 9) {
//         return {
//           fontSize: '2rem',
//           padding: '36px 40px',
//         }
//       }

//       return {}
//     }}
//     wrapperStyle={({ index }) => {
//       if (index === 0 || index === 9) {
//         return {
//           height: 288,
//           gridRowStart: 'span 2',
//           gridColumnStart: 'span 2',
//         }
//       }

//       return {
//         width: 140,
//         height: 140,
//       }
//     }}
//   />
// )

// export const DragHandle = () => <Sortable {...props} handle />

// export const ScrollContainer = () => (
//   <div
//     style={{
//       height: '50vh',
//       margin: '0 auto',
//       overflow: 'auto',
//     }}
//   >
//     <Sortable {...props} />
//   </div>
// )

// export const Swappable = () => (
//   <Sortable
//     {...props}
//     strategy={rectSwappingStrategy}
//     reorderItems={arraySwap}
//     getNewIndex={({ id, items, activeIndex, overIndex }) =>
//       arraySwap(items, activeIndex, overIndex).indexOf(id)
//     }
//   />
// )

export const PressDelay = (props) => {
  console.log(' PressDelay ： ', props)
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true })
  return (
    <Sortable
      {...defProps}
      {...props}
      activationConstraint={{
        delay: 400,
        tolerance: 5,
      }}
      // animateLayoutChanges={animateLayoutChanges}
      measuring={{ droppable: { strategy: MeasuringStrategy.Always } }} // 删除动画效果
      removable
      // handle
    />
  )
}

const Grid = PressDelay
export default Grid

// export const MinimumDistance = () => (
//   <Sortable
//     {...props}
//     activationConstraint={{
//       distance: 15,
//     }}
//   />
// )

// export const RemovableItems = () => {
//   const animateLayoutChanges: AnimateLayoutChanges = (args) =>
//     defaultAnimateLayoutChanges({ ...args, wasDragging: true })

//   return (
//     <Sortable
//       {...props}
//       animateLayoutChanges={animateLayoutChanges}
//       measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
//       removable
//       handle
//     />
//   )
// }