export function getEnumStatus(enumStatus) {
  switch(enumStatus) {
    case 1: return "locked";
    case 2: return "complete";
    case 3: return "refunded";
    case 4: return "cancelled";
    default: return "created";
  }
}

export function convertStatus(type) {
  switch(type) {
    case 'bought': return "locked";
    default: return "created";
  }
}