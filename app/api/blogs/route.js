export async function GET() {
  try {
    const TOKEN = process.env.WEBFLOW_TOKEN;
    const COLLECTION_ID = process.env.WEBFLOW_BLOG_COLLECTION_ID;

    if (!TOKEN || !COLLECTION_ID) {
      return Response.json(
        { error: "Missing WEBFLOW_TOKEN or WEBFLOW_BLOG_COLLECTION_ID" },
        { status: 500 },
      );
    }

    let allBlogs = [];
    let offset = 0;
    const limit = 100;

    while (true) {
      const response = await fetch(
        `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          { error: "Webflow API error", details: data },
          { status: response.status },
        );
      }

      allBlogs.push(...data.items);

      const total = data.pagination?.total || 0;

      if (allBlogs.length >= total || data.items.length === 0) {
        break;
      }

      offset += limit;
    }

    return Response.json({
      total: allBlogs.length,
      blogs: allBlogs,
    });
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 },
    );
  }
}
