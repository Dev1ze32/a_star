import { CAMPUS_WIDTH, CAMPUS_HEIGHT } from './buildingsConfig';

export const OUTDOOR_NODES = {
  // ┌─────────────────────────────────────────────────────────────────┐
  // │ MAIN BUILDING EXIT CONNECTION                                    │
  // └─────────────────────────────────────────────────────────────────┘
  'Main_Exit': {
    id: 'Main_Exit',
    x: 600,
    y: 420,           // ✅ UPDATED to match new Main Building Y (380 + offset)
    floor: 0,
    building: 'outdoor',
    type: 'exit',
    label: 'Main Exit',
    neighbors: ['Road_Central_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ CENTRAL CAMPUS ROAD NODES                                        │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_Central_1': {
    id: 'Road_Central_1',
    x: 600,
    y: 350,           // ✅ Shifted Up
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Main_Exit', 'Road_Central_2']
  },

  'Road_Central_2': {
    id: 'Road_Central_2',
    x: 600,
    y: 290,           // ✅ Shifted Up
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Central_1', 'Road_Junction']
  },

  'Road_Junction': {
    id: 'Road_Junction',
    x: 600,
    y: 240,           // ✅ Shifted Up (Intersection)
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Junction',
    neighbors: ['Road_Central_2', 'Road_ToNursing_1', 'Road_ToBCH_1']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO NURSING BUILDING                                         │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_ToNursing_1': {
    id: 'Road_ToNursing_1',
    x: 700,
    y: 240, // Match Junction Y
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Junction', 'Road_ToNursing_2']
  },

  'Road_ToNursing_2': {
    id: 'Road_ToNursing_2',
    x: 800,
    y: 240, // Match Junction Y
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToNursing_1', 'Road_ToNursing_3']
  },

  'Road_ToNursing_3': {
    id: 'Road_ToNursing_3',
    x: 880,
    y: 240, // Match Junction Y
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToNursing_2']
  },

  // ┌─────────────────────────────────────────────────────────────────┐
  // │ PATH TO BCH BUILDING                                             │
  // └─────────────────────────────────────────────────────────────────┘
  'Road_ToBCH_1': {
    id: 'Road_ToBCH_1',
    x: 520,
    y: 190,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_Junction', 'Road_ToBCH_2']
  },

  'Road_ToBCH_2': {
    id: 'Road_ToBCH_2',
    x: 450,
    y: 140,
    floor: 0,
    building: 'outdoor',
    type: 'road',
    label: 'Path',
    neighbors: ['Road_ToBCH_1']
  }
};

export const ROAD_SEGMENTS = [
  // Main Building to Junction
  { x1: 600, y1: 420, x2: 600, y2: 240 },
  
  // Junction to Nursing Building
  { x1: 600, y1: 240, x2: 880, y2: 240 },
  
  // Junction to BCH Building
  { x1: 600, y1: 240, x2: 450, y2: 140 }
];

export const getOutdoorNodes = () => Object.values(OUTDOOR_NODES);
export const isOutdoorNode = (nodeId) => OUTDOOR_NODES.hasOwnProperty(nodeId);