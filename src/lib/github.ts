import type { PinnedRepo } from './types'

const GITHUB_GRAPHQL = 'https://api.github.com/graphql'

const PINNED_REPOS_QUERY = `
  query PinnedRepos($username: String!) {
    user(login: $username) {
      pinnedItems(first: 6, types: [REPOSITORY]) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
            languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
              edges { size node { name color } }
              totalSize
            }
            repositoryTopics(first: 10) {
              nodes { topic { name } }
            }
            updatedAt
            homepageUrl
            openGraphImageUrl
          }
        }
      }
    }
  }
`

interface RawRepo {
  name: string
  description: string | null
  url: string
  stargazerCount: number
  forkCount: number
  primaryLanguage: { name: string; color: string } | null
  languages: {
    edges: Array<{ size: number; node: { name: string; color: string } }>
    totalSize: number
  }
  repositoryTopics: { nodes: Array<{ topic: { name: string } }> }
  updatedAt: string
  homepageUrl: string | null
  openGraphImageUrl: string
}

function mapRepo(raw: RawRepo): PinnedRepo {
  const languages = raw.languages.edges.map((e) => ({
    name: e.node.name,
    color: e.node.color,
    percentage:
      raw.languages.totalSize > 0
        ? Math.round((e.size / raw.languages.totalSize) * 100)
        : 0,
  }))

  return {
    name: raw.name,
    description: raw.description,
    url: raw.url,
    stargazerCount: raw.stargazerCount,
    forkCount: raw.forkCount,
    primaryLanguage: raw.primaryLanguage,
    languages,
    topics: raw.repositoryTopics.nodes.map((n) => n.topic.name),
    updatedAt: raw.updatedAt,
    homepageUrl: raw.homepageUrl,
    openGraphImageUrl: raw.openGraphImageUrl,
  }
}

export async function getPinnedRepos(): Promise<PinnedRepo[]> {
  const token = process.env.GITHUB_TOKEN?.trim()
  const username = process.env.GITHUB_USERNAME?.trim()

  if (!token || !username) {
    console.warn('GITHUB_TOKEN or GITHUB_USERNAME not set — returning empty repos')
    return []
  }

  try {
    const res = await fetch(GITHUB_GRAPHQL, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: PINNED_REPOS_QUERY, variables: { username } }),
      cache: 'no-store',
    })

    if (!res.ok) {
      console.error('GitHub API error:', res.status)
      return []
    }

    const json = await res.json()
    const nodes: RawRepo[] = json?.data?.user?.pinnedItems?.nodes ?? []
    return nodes.map(mapRepo)
  } catch (err) {
    console.error('Failed to fetch pinned repos:', err)
    return []
  }
}
