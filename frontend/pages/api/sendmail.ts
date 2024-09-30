import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    try {
      // Access query parameters if any are sent
      const queryData = req.query;

      console.log("Received query data:", queryData);

      // Respond with a success message
      res.status(200).json({ message: "GET request received successfully" });
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // If the request method is not GET, return a 405 status code
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
