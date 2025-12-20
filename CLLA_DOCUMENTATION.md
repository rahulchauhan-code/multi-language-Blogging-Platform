# CLLA (Client-Server Language Abstraction) Documentation

## Overview

CLLA is a comprehensive abstraction layer designed for the Multi Language Blogging Platform. It provides:

- **Centralized API Communication** - Single point for all server requests
- **Language Abstraction** - Handle multi-language support seamlessly
- **Automatic Caching** - Built-in request caching with expiry
- **Retry Logic** - Automatic retry with exponential backoff
- **Error Handling** - Consistent error handling and localization
- **React Hooks** - Easy integration with React components

## File Structure

```
src/
├── services/
│   ├── apiService.js          # Raw API calls to Spring Boot
│   ├── clla.js                # Main CLLA abstraction layer
│   └── cllaExamples.js        # Usage examples
├── hooks/
│   └── useCLLA.js             # React hooks for CLLA
├── components/
│   └── BlogList.jsx           # Example using CLLA hooks
```

## Core Components

### 1. CLLABlogService

Handles all blog-related operations with automatic caching and retry logic.

#### Methods:

```javascript
// Get all posts (with optional language filter)
await CLLABlogService.getAllPosts(language, useCache)

// Get single post by ID
await CLLABlogService.getPostById(id, useCache)

// Create new post
await CLLABlogService.createPost(postData)

// Update existing post
await CLLABlogService.updatePost(id, postData)

// Delete post
await CLLABlogService.deletePost(id)
```

### 2. CLLALanguageService

Manages language-related operations.

#### Methods:

```javascript
// Get all supported languages
await CLLALanguageService.getAllLanguages(useCache)

// Get posts in specific language
await CLLALanguageService.getPostsByLanguage(language, useCache)
```

### 3. CLLAUtils

Utility functions for error handling, caching, and localization.

#### Methods:

```javascript
// Clear all cache
CLLAUtils.clearCache()

// Get cache statistics
CLLAUtils.getCacheStats()

// Format error response
CLLAUtils.formatError(error)

// Format success response
CLLAUtils.formatSuccess(data, message)

// Translate error messages
CLLAUtils.translateError(errorCode, language)
```

## React Hooks

### useBlogPosts

Fetch all blog posts with loading and error states.

```javascript
import { useBlogPosts } from '../hooks/useCLLA'

export default function MyComponent() {
  const { posts, loading, error, refetch } = useBlogPosts(language, autoFetch)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{posts.map(post => <div key={post.id}>{post.title}</div>)}</div>
}
```

### useBlogPost

Fetch a single blog post by ID.

```javascript
import { useBlogPost } from '../hooks/useCLLA'

export default function PostDetail({ postId }) {
  const { post, loading, error, refetch } = useBlogPost(postId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>{post.title}</div>
}
```

### usePostsByLanguage

Fetch posts for a specific language.

```javascript
import { usePostsByLanguage } from '../hooks/useCLLA'

export default function LanguagePosts({ language }) {
  const { posts, loading, error } = usePostsByLanguage(language)

  // Use posts, loading, error...
}
```

### useLanguages

Fetch all available languages.

```javascript
import { useLanguages } from '../hooks/useCLLA'

export default function LanguageSelector() {
  const { languages, loading, error } = useLanguages()

  if (loading) return <div>Loading languages...</div>
  
  return (
    <select>
      {languages.map(lang => <option key={lang.code}>{lang.name}</option>)}
    </select>
  )
}
```

### useCreateBlogPost

Create a new blog post.

```javascript
import { useCreateBlogPost } from '../hooks/useCLLA'

export default function CreatePostForm() {
  const { createPost, loading, error } = useCreateBlogPost()

  const handleSubmit = async (formData) => {
    try {
      const newPost = await createPost(formData)
      console.log('Post created:', newPost)
    } catch (err) {
      console.error('Failed to create post')
    }
  }

  return <form onSubmit={() => handleSubmit({ /* data */ })}>...</form>
}
```

### useUpdateBlogPost

Update an existing blog post.

```javascript
import { useUpdateBlogPost } from '../hooks/useCLLA'

export default function EditPostForm({ postId }) {
  const { updatePost, loading, error } = useUpdateBlogPost()

  const handleSubmit = async (formData) => {
    const updated = await updatePost(postId, formData)
  }

  // Form JSX...
}
```

### useDeleteBlogPost

Delete a blog post.

```javascript
import { useDeleteBlogPost } from '../hooks/useCLLA'

export default function DeleteButton({ postId }) {
  const { deletePost, loading } = useDeleteBlogPost()

  const handleDelete = async () => {
    await deletePost(postId)
  }

  return <button onClick={handleDelete}>{loading ? 'Deleting...' : 'Delete'}</button>
}
```

### useCLLACache

Manage the CLLA cache.

```javascript
import { useCLLACache } from '../hooks/useCLLA'

export default function CacheManager() {
  const { cacheStats, clearCache } = useCLLACache()

  return (
    <div>
      <p>Cached items: {cacheStats.size}</p>
      <button onClick={clearCache}>Clear Cache</button>
    </div>
  )
}
```

## Configuration

Edit `CLLA_CONFIG` in `clla.js` to customize behavior:

```javascript
const CLLA_CONFIG = {
  timeout: 10000,           // Request timeout in ms
  retryAttempts: 3,         // Number of retry attempts
  retryDelay: 1000,         // Delay between retries in ms
  cacheExpiry: 5 * 60 * 1000, // Cache expiry in ms (5 minutes)
}
```

## Error Handling

CLLA provides multilingual error messages:

```javascript
const errorMsg = CLLAUtils.translateError('FETCH_ERROR', 'es')
// Result: "Error al obtener datos"
```

Supported languages: English (en), Spanish (es), French (fr), German (de)

## Supported Error Codes

- `FETCH_ERROR` - Failed to fetch data
- `CREATE_ERROR` - Failed to create item
- `UPDATE_ERROR` - Failed to update item
- `DELETE_ERROR` - Failed to delete item
- `NETWORK_ERROR` - Network connection error

## Caching Strategy

CLLA automatically caches:
- All GET requests
- Language data
- Individual posts

Cache is automatically cleared on:
- POST requests (create new post)
- PUT requests (update post)
- DELETE requests (delete post)

Manual cache management:

```javascript
// Clear all cache
CLLAUtils.clearCache()

// View cache statistics
const stats = CLLAUtils.getCacheStats()
console.log(stats) // { size: 5, keys: [...] }
```

## Best Practices

1. **Use Hooks in Components** - Prefer React hooks over direct service calls
2. **Handle Errors Gracefully** - Always check error state in components
3. **Manage Loading State** - Show loading indicators to users
4. **Clear Cache When Needed** - Manually clear cache after bulk operations
5. **Use Language Filter** - Always specify language when fetching posts for specific users

## Example: Complete Blog Post Page

```javascript
import { useBlogPost, useUpdateBlogPost, useDeleteBlogPost } from '../hooks/useCLLA'

export default function BlogPostPage({ postId }) {
  const { post, loading: postLoading } = useBlogPost(postId)
  const { updatePost, loading: updateLoading } = useUpdateBlogPost()
  const { deletePost, loading: deleteLoading } = useDeleteBlogPost()

  const handleUpdate = async (newData) => {
    await updatePost(postId, newData)
  }

  const handleDelete = async () => {
    await deletePost(postId)
  }

  if (postLoading) return <div>Loading post...</div>

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
      <button onClick={() => handleUpdate({...})} disabled={updateLoading}>
        {updateLoading ? 'Updating...' : 'Update'}
      </button>
      <button onClick={handleDelete} disabled={deleteLoading}>
        {deleteLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )
}
```

## Troubleshooting

### Cache Issues
- Clear cache: `CLLAUtils.clearCache()`
- Check cache: `CLLAUtils.getCacheStats()`

### Request Failures
- Check console for detailed error logs
- Verify Spring Boot API is running
- Check network in browser DevTools

### Retry Logic
- Automatic retries happen silently for failed requests
- Configure retry attempts in `CLLA_CONFIG`

---

For more examples, see `cllaExamples.js`
