/**
 * Renders one or more JSON-LD blocks as a single non-visible <script> tag.
 *
 * Schema.org structured data lets Google, Bing and AI Overviews understand
 * the brand, products, locations, FAQs and articles on Magppie.com without
 * us having to re-state any visible page content. Drop a <JsonLd /> with
 * the relevant schema(s) anywhere inside a page's JSX; it produces no
 * visible output.
 *
 * Pass either a single object or an array. Multiple blocks for the same
 * page (e.g. Organization + WebSite + Breadcrumb + Product) can all share
 * one <script> via the array form; Google parses each entry independently.
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        // Defence-in-depth: replace `<` with its unicode escape so a hostile
        // string ending in `</script>` (e.g. via a future Sanity-fed name
        // field) cannot break out of the script tag. JSON parsers honour
        // <, browsers don't see a `<` in the raw HTML stream.
        __html: JSON.stringify(payload).replace(/</g, '\\u003c')
      }}
    />
  );
}
