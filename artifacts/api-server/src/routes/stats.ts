import { Router } from "express";
import { FetchStatsBody } from "@workspace/api-zod";

const router = Router();

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const LEETCODE_QUERY = `
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      username
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
      }
      profile {
        ranking
      }
    }
  }
`;

router.post("/stats", async (req, res) => {
  const parseResult = FetchStatsBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { username, email, github } = parseResult.data;

  if (!username) {
    res.status(400).json({ error: "Username is required" });
    return;
  }

  try {
    // Fetch LeetCode stats
    const lcResponse = await fetch(LEETCODE_GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://leetcode.com",
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username },
      }),
    });

    if (!lcResponse.ok) {
      res.status(500).json({ error: "Failed to fetch data from LeetCode" });
      return;
    }

    const lcResult = (await lcResponse.json()) as {
      data?: {
        matchedUser?: {
          username: string;
          submitStats: {
            acSubmissionNum: Array<{
              difficulty: string;
              count: number;
              submissions: number;
            }>;
          };
          profile: { ranking: number };
        };
      };
    };

    if (!lcResult.data?.matchedUser) {
      res
        .status(404)
        .json({ error: `User '${username}' not found on LeetCode` });
      return;
    }

    const userData = lcResult.data.matchedUser;
    const submitStats = userData.submitStats.acSubmissionNum;

    const stats = {
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
    };

    for (const stat of submitStats) {
      const difficulty = stat.difficulty.toLowerCase();
      if (difficulty === "all") stats.totalSolved = stat.count;
      else if (difficulty === "easy") stats.easySolved = stat.count;
      else if (difficulty === "medium") stats.mediumSolved = stat.count;
      else if (difficulty === "hard") stats.hardSolved = stat.count;
    }

    // Fetch GitHub stats (optional)
    let githubRepos = 0;
    if (github) {
      try {
        const ghResponse = await fetch(
          `https://api.github.com/users/${github}`,
          {
            headers: {
              "User-Agent": "leetcode-dashboard",
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (ghResponse.ok) {
          const ghData = (await ghResponse.json()) as {
            public_repos?: number;
          };
          githubRepos = ghData.public_repos ?? 0;
        }
      } catch {
        // GitHub fetch failed, keep default 0
      }
    }

    res.json({
      email: email ?? "Not provided",
      username: userData.username,
      totalSolved: stats.totalSolved,
      easySolved: stats.easySolved,
      mediumSolved: stats.mediumSolved,
      hardSolved: stats.hardSolved,
      ranking: userData.profile?.ranking ?? null,
      githubRepos,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
