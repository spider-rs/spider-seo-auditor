"use client";

import { useState } from "react";
import SearchBar from "./searchbar";
import { Badge } from "@/components/ui/badge";

interface SEOCheck {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

interface PageAudit {
  url: string;
  score: number;
  checks: SEOCheck[];
}

function auditPage(url: string, html: string): PageAudit {
  const checks: SEOCheck[] = [];
  let score = 100;

  // Title check
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!titleMatch) {
    checks.push({ name: "Title", status: "fail", message: "Missing title tag" });
    score -= 20;
  } else {
    const len = titleMatch[1].trim().length;
    if (len < 30 || len > 70) {
      checks.push({ name: "Title", status: "warn", message: `Title length: ${len} chars (ideal: 50-60)` });
      score -= 5;
    } else {
      checks.push({ name: "Title", status: "pass", message: `Title: "${titleMatch[1].trim().slice(0, 50)}..." (${len} chars)` });
    }
  }

  // Meta description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (!descMatch) {
    checks.push({ name: "Meta Description", status: "fail", message: "Missing meta description" });
    score -= 15;
  } else {
    const len = descMatch[1].length;
    if (len < 120 || len > 170) {
      checks.push({ name: "Meta Description", status: "warn", message: `Description length: ${len} chars (ideal: 150-160)` });
      score -= 5;
    } else {
      checks.push({ name: "Meta Description", status: "pass", message: `Description: ${len} chars` });
    }
  }

  // H1 count
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1Count === 0) {
    checks.push({ name: "H1", status: "fail", message: "No H1 tag found" });
    score -= 15;
  } else if (h1Count > 1) {
    checks.push({ name: "H1", status: "warn", message: `${h1Count} H1 tags found (should be 1)` });
    score -= 5;
  } else {
    checks.push({ name: "H1", status: "pass", message: "Single H1 tag found" });
  }

  // Images without alt
  const imgCount = (html.match(/<img[\s]/gi) || []).length;
  const noAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;
  if (noAlt > 0) {
    checks.push({ name: "Image Alt", status: "warn", message: `${noAlt}/${imgCount} images missing alt text` });
    score -= Math.min(10, noAlt * 2);
  } else if (imgCount > 0) {
    checks.push({ name: "Image Alt", status: "pass", message: `All ${imgCount} images have alt text` });
  }

  // OG tags
  const hasOgTitle = /<meta[^>]*property=["']og:title["']/i.test(html);
  const hasOgDesc = /<meta[^>]*property=["']og:description["']/i.test(html);
  if (!hasOgTitle || !hasOgDesc) {
    checks.push({ name: "Open Graph", status: "warn", message: `Missing ${!hasOgTitle ? "og:title" : ""} ${!hasOgDesc ? "og:description" : ""}`.trim() });
    score -= 5;
  } else {
    checks.push({ name: "Open Graph", status: "pass", message: "OG title and description present" });
  }

  return { url, score: Math.max(0, score), checks };
}

export default function Auditor() {
  const [data, setData] = useState<any[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  const audits: PageAudit[] = (data || [])
    .filter((p) => p?.url && p?.content)
    .map((p) => auditPage(p.url, p.content));

  const avgScore = audits.length ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length) : 0;

  return (
    <div className="flex flex-col h-screen">
      <SearchBar setDataValues={setData} />
      <div className="flex-1 overflow-auto p-4">
        {audits.length > 0 && (
          <>
            <div className="flex items-center gap-6 mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${avgScore >= 80 ? "border-green-500 text-green-500" : avgScore >= 50 ? "border-yellow-500 text-yellow-500" : "border-red-500 text-red-500"}`}>
                {avgScore}
              </div>
              <div>
                <h2 className="text-xl font-bold">Overall SEO Score</h2>
                <p className="text-muted-foreground">{audits.length} pages audited</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden">
              {audits.map((audit) => (
                <div key={audit.url} className="border-b last:border-b-0">
                  <button className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 text-left" onClick={() => setExpanded(expanded === audit.url ? null : audit.url)}>
                    <span className={`text-sm font-bold ${audit.score >= 80 ? "text-green-500" : audit.score >= 50 ? "text-yellow-500" : "text-red-500"}`}>{audit.score}</span>
                    <span className="flex-1 truncate text-sm">{audit.url}</span>
                    <span className="text-xs text-muted-foreground">{audit.checks.filter((c) => c.status === "fail").length} issues</span>
                  </button>
                  {expanded === audit.url && (
                    <div className="px-6 pb-3 space-y-2">
                      {audit.checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Badge variant={check.status === "pass" ? "default" : check.status === "warn" ? "secondary" : "destructive"} className="w-12 justify-center text-xs">
                            {check.status}
                          </Badge>
                          <span className="font-medium w-32">{check.name}</span>
                          <span className="text-muted-foreground">{check.message}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {!data && <div className="flex items-center justify-center h-full text-muted-foreground">Enter a URL to audit SEO</div>}
      </div>
    </div>
  );
}
