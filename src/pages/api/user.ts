import geoip from 'fast-geoip';

export default async function handler(req: any, res: any) {
  const ip = req.headers['x-forwarded-for'] as string;
  const geo = (await geoip.lookup(ip)) || {};

  res.status(200).json({ ...geo, ip });
}
