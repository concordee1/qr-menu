// src/app/api/settings/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Setting from '@/models/Setting';

// GET handler to fetch all settings
export async function GET() {
  await dbConnect();
  try {
    const settingsDocs = await Setting.find({});
    // Convert the array of documents into a single object like { key: value, ... }
    const settings = settingsDocs.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, any>);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json({ success: false, message: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST handler to update settings
export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    
    // Create an array of update operations
    const updateOperations = Object.keys(body).map(key => ({
      updateOne: {
        filter: { key },
        update: { $set: { value: body[key] } },
        upsert: true, // If the setting doesn't exist, create it
      },
    }));

    // Execute all operations in a single bulk write
    if (updateOperations.length > 0) {
      await Setting.bulkWrite(updateOperations);
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully' });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
