export async function GET(_request, { params }) {
  try {
    const { slug } = await params;

    const TOKEN = process.env.WEBFLOW_TOKEN;
    const COLLECTION_ID = process.env.WEBFLOW_BLOG_COLLECTION_ID;

    if (!TOKEN || !COLLECTION_ID) {
      return Response.json(
        { error: "Missing WEBFLOW_TOKEN or WEBFLOW_BLOG_COLLECTION_ID" },
        { status: 500 },
      );
    }

    const response = await fetch(
      `https://api.webflow.com/v2/collections/${COLLECTION_ID}/items?limit=100`,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: "Webflow API error", details: data },
        { status: response.status },
      );
    }

    const blog = data.items.find((item) => item.fieldData?.slug === slug);

    if (!blog) {
      return Response.json(
        { error: "Blog not found", receivedSlug: slug },
        { status: 404 },
      );
    }

    return Response.json(blog);
  } catch (error) {
    return Response.json(
      { error: "Something went wrong", message: error.message },
      { status: 500 },
    );
  }
}
