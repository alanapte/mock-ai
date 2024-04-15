import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new NextResponse(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Allow': 'GET'
      }
    });
  }

  try {
    /* In production, this route would do a database call to get the corresponding pre-generated interview sections breakdown.
     * For the sake of this project, I already created a json file using ChatGPT with data similar to what would be used */

    // Adjust the file path according to where you store the JSON file in your project
    const filePath = path.join(process.cwd(), 'public', 'interview_breakdown.json');
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Respond with the 'sections' array from the JSON data
    return new NextResponse(JSON.stringify(jsonData.sections), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.error(err);
    return new NextResponse(JSON.stringify({ error: 'Failed to read interview breakdown file.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
