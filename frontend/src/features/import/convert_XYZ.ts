import proj4 from 'proj4'

const utmZone47N = '+proj=utm +zone=47 +datum=WGS84 +units=m +no_defs';
const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';

export function Convert_XYZ(x: number, y: number) {
    return proj4(utmZone47N, wgs84, [x, y])
}