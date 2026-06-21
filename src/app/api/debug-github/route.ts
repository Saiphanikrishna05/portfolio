import { NextResponse } from 'next/server'

export async function GET() {
  const token = process.env.GITHUB_TOKEN
  const username = process.env.GITHUB_USERNAME

  if (!token || !username) {
    return NextResponse.json({ error: 'env vars missing', token: !!token, username: !!username })
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { Authorization: `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query PinnedRepos($username: String!) { user(login: $username) { pinnedItems(first: 6, types: [REPOSITORY]) { nodes { ... on Repository { name homepageUrl } } } } }`,
        variables: { username },
      }),
      cache: 'no-store',
    })
    const json = await res.json()
    return NextResponse.json({ status: res.status, body: json })
  } catch (err) {
    return NextResponse.json({ error: String(err) })
  }
}
