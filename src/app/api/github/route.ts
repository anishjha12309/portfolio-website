import { NextResponse } from 'next/server';

const GITHUB_USERNAME = 'anishjha12309';

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface Commit {
  sha: string;
  message: string;
  date: string;
  repo: string;
  url: string;
}

export async function GET() {
  try {
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { error: 'GitHub token not configured' },
        { status: 500 }
      );
    }

    // Combined GraphQL query for contributions, commits, AND stats
    const query = `
      query($username: String!) {
        user(login: $username) {
          followers {
            totalCount
          }
          repositories(first: 100, privacy: PUBLIC) {
            totalCount
            nodes {
              stargazerCount
            }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                }
              }
            }
          }
          recentRepos: repositories(first: 10, orderBy: {field: PUSHED_AT, direction: DESC}, privacy: PUBLIC) {
            nodes {
              name
              defaultBranchRef {
                target {
                  ... on Commit {
                    history(first: 3) {
                      nodes {
                        oid
                        message
                        committedDate
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const graphqlResponse = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username: GITHUB_USERNAME },
      }),
      cache: 'no-store',
    });

    const graphqlData = await graphqlResponse.json();
    
    if (graphqlData.errors) {
      console.error('GraphQL errors:', graphqlData.errors);
      return NextResponse.json(
        { error: 'Failed to fetch GitHub data' },
        { status: 500 }
      );
    }

    const user = graphqlData.data?.user;
    const calendar = user?.contributionsCollection?.contributionCalendar;
    const totalContributions = calendar?.totalContributions || 0;
    const weeks: ContributionWeek[] = calendar?.weeks || [];

    // Extract stats
    const totalRepos = user?.repositories?.totalCount || 0;
    const followers = user?.followers?.totalCount || 0;
    const totalStars = (user?.repositories?.nodes || []).reduce(
      (sum: number, repo: { stargazerCount: number }) => sum + (repo?.stargazerCount || 0), 
      0
    );

    // Extract commits from recent repositories
    const allCommits: Commit[] = [];
    const repos = user?.recentRepos?.nodes || [];
    
    for (const repo of repos) {
      const commits = repo?.defaultBranchRef?.target?.history?.nodes || [];
      for (const commit of commits) {
        allCommits.push({
          sha: commit.oid,
          message: commit.message.split('\n')[0], // First line only
          date: commit.committedDate,
          repo: repo.name,
          url: commit.url,
        });
      }
    }

    // Sort by date descending and take top 5
    const recentCommits = allCommits
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    console.log('Fetched commits:', recentCommits.length);

    return NextResponse.json({
      totalContributions,
      weeks,
      recentCommits,
      stats: {
        repos: totalRepos,
        followers,
        stars: totalStars,
      },
    });

  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
