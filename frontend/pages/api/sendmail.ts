import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method === "POST") {
    try {
      // 获取请求体的数据
      const formData = req.body;

      // 在这里处理你收到的数据，例如发送邮件或保存到数据库
      console.log("Received form data:", formData);

      // 响应成功消息
      res.status(201).json({ message: "Form data received successfully" });
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    // 如果请求方法不是 POST，返回 405 状态码
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}