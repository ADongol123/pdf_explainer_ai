import { anthropic } from "@ai-sdk/anthropic"
import { generateObject } from "ai"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile) {
      return Response.json({ error: "No PDF file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = await pdfFile.arrayBuffer()

    // Generate topics based on PDF content
    const result = await generateObject({
      model: anthropic("claude-3-5-sonnet-latest"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this PDF and generate 5 specific topic suggestions that would be helpful for a user to ask about. Make them specific to the content, not generic. Keep each topic under 40 characters.",
            },
            {
              type: "file",
              data: buffer,
              mimeType: "application/pdf",
            },
          ],
        },
      ],
      schema: z.object({
        topics: z.array(z.string()).describe("List of 5 specific topic suggestions based on the PDF content"),
      }),
    })

    return Response.json({ topics: result.object.topics })
  } catch (error) {
    console.error("Error analyzing PDF:", error)
    return Response.json(
      {
        error: "Failed to analyze PDF",
        topics: ["Summarize this document", "Key points", "Main arguments", "Conclusions", "Recommendations"],
      },
      { status: 500 },
    )
  }
}

