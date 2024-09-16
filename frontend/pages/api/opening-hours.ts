// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

type Data = {
  openingHours?: string[];
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = "YOUR_API_KEY"; 
  const placeId = "ChIJeeMv3fjPsGoRqQoVj86mqvM"; 
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=opening_hours&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.result?.opening_hours?.weekday_text) {
      res.status(200).json({ openingHours: response.data.result.opening_hours.weekday_text });
    } else {
      res.status(404).json({ error: "No opening hours available" });
    }
  } catch (err) {
    console.error(err); 
    res.status(500).json({ error: "Request failed" });
  }
  
}
