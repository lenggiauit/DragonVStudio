using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services.Communication.Request;
using DragonVStudio.API.Extensions;
using System;
using System.Collections.Generic;
using System.Linq; 
using System.Threading.Tasks;

namespace DragonVStudio.API.Persistence.Repositories
{
    public class BlogRepository : BaseRepository, IBlogRepository
    {
        private readonly ILogger<BlogRepository> _logger;
        public BlogRepository(DragonVContext context, ILogger<BlogRepository> logger) : base(context)
        {
            _logger = logger;
        }

        public async Task<(Comment, ResultCode)> AddComment(BaseRequest<AddCommmentRequest> request, Guid userId)
        {
            try
            { 
                var comment = new Comment()
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    PostId = request.Payload.PostId,
                    ParentId = request.Payload.ParentId,
                    CommentContent = request.Payload.CommentContent, 
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now, 
                };
                await _context.Comment.AddAsync(comment);
                await _context.SaveChangesAsync();
                return (comment, ResultCode.Success);
                
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at AddComment method: " + ex.Message);
                return (null, ResultCode.Error);

            }
        }

        public async Task<ResultCode> RemoveComment(BaseRequest<RemoveCommmentRequest> request, Guid userId)
        {
            try
            {
                var comment = await _context.Comment.Where(c => c.Id.Equals(request.Payload.CommentId)).FirstOrDefaultAsync();
                if(comment != null)
                {
                    comment.IsDeleted = true;
                    comment.UpdatedBy = userId;
                    comment.UpdatedDate = DateTime.Now;
                    _context.Comment.Update(comment);
                    await _context.SaveChangesAsync();
                    return (ResultCode.Success);
                }
                else
                {
                    return (ResultCode.Invalid);
                } 
            }
            catch (Exception ex)
            {
                _logger.LogError("Error at RemoveComment method: " + ex.Message);
                return ( ResultCode.Error);

            }
        }

        public async Task<(BlogPost, ResultCode)> GetBlogPostDetail(string postUrl)
        {
            try
            { 
                return (await _context.BlogPost
                    .AsNoTracking()
                    .Include(p => p.Category)
                    .Include(p => p.Tags)
                    .Include(p => p.User)
                    .AsNoTracking()
                    .Where(p => p.Url.Equals(postUrl))
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription,
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        UpdatedDate = p.UpdatedDate,
                        CreatedDate = p.CreatedDate,
                        Category = p.Category,
                        Tags = p.Tags,
                        User = p.User,
                        Content = p.Content,
                        
                    }) 
                    .FirstOrDefaultAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetBlogPostDetail method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<Category>, ResultCode)> GetCategory()
        {
            try
            {
                return (await _context.Category
                    .AsNoTracking()
                    .AsQueryable()
                    .Where(c => !c.IsArchived)
                    .Select(c => new Category()
                    { 
                        Name = c.Name,
                        Color = c.Color,
                        Url = c.Url
                    })  
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetCategory method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<Comment>, ResultCode)> GetComments(BaseRequest<CommmentRequest> request)
        {
            try
            {
                var query = _context.Comment.AsQueryable(); 
                var totalRow = await query.Where(c => !c.IsDeleted).CountAsync();

                return (await query
                    .Include(c => c.User)
                    
                    .AsNoTracking()
                    .Where(c => !c.IsDeleted)
                    .Select(c => new Comment()
                    {
                        Id = c.Id,
                        ParentId = c.ParentId,
                        CreatedDate = c.CreatedDate,
                        CommentContent = c.CommentContent,
                        PostId = c.PostId,
                        User = c.User, 
                        TotalRows = totalRow
                    })
                    .OrderBy(p => p.CreatedDate) 
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetComments method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetPosts(BaseRequest<BlogPostSearchRequest> request)
        {
            try
            {
                var query = _context.BlogPost.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Title.Contains(request.Payload.Keywords)); 
                }

                var totalRow = await query.Where(p => p.IsPublic).CountAsync();

                return (await query
                    .Include(p => p.Category)
                    .Include(p => p.Tags)
                    .AsNoTracking() 
                    .Where(p => p.IsPublic)
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription,
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        UpdatedDate = p.UpdatedDate,
                        CreatedDate = p.CreatedDate,
                        Category = p.Category,
                        Tags = p.Tags,
                        TotalRows = totalRow
                    })
                    .OrderByDescending(p => p.CreatedDate) 
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetTopPost method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetRelatedPost(string categoryUrl, string notIn)
        {
            try
            {
                return (await _context.BlogPost
                    
                    .AsNoTracking()
                    .AsQueryable()
                    .Where(p => !p.IsArchived && !p.Url.Equals(notIn))
                    .Join(_context.Category.Where(c => c.Url.Equals(categoryUrl)), p => p.CategoryId, c => c.Id, (p, c) => p)
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title, 
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment
                    })
                    .OrderBy(p => p.View)
                    .OrderBy(p => p.Comment)
                    .Take(5)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetRelatedPost method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<Tag>, ResultCode)> GetTags()
        {
            try
            {
                return await Task.FromResult( ( _context.Tag
                    .AsNoTracking()
                    .AsQueryable()
                    .AsEnumerable()
                    .Select(t => new Tag()
                    {
                        Id = t.Id,
                        Name = t.Name, 
                        Url = t.Url
                    }) 
                    .OrderBy(c => Guid.NewGuid()) 
                    .GroupBy(x => x.Name).Select(x => x.First())
                    .Distinct() 
                    .Take(15) 
                    .ToList(), ResultCode.Success));

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetTags method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetTopPost()
        {
            try
            {
                return (await _context.BlogPost
                    .Include(p => p.Category)
                    .AsNoTracking()
                    .AsQueryable() 
                    .Where(p => p.IsPublic)
                    .Select(p => new BlogPost()
                    { 
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription, 
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        Category = p.Category,
                    })
                    .OrderBy(p => p.View)
                    .OrderBy(p => p.Comment)
                    .Distinct()
                    .Take(10)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetTopPost method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetBlogPostByCategory(BaseRequest<BlogPostByUrlRequest> request)
        {
            try
            {
                var query = _context.BlogPost.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Title.Contains(request.Payload.Keywords));
                }

                var totalRow = await query.Where(p => p.IsPublic).CountAsync();

                return (await query.Join(
                    
                    _context.Category.Where( c => c.Url.Equals(request.Payload.Url)),
                    p => p.CategoryId,
                    c => c.Id, 
                    ( p, c) => p )
                    .Include(p => p.Category)
                    .Include(p => p.Tags)
                    .AsNoTracking()
                    .Where(p => p.IsPublic)
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription,
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        UpdatedDate = p.UpdatedDate,
                        CreatedDate = p.CreatedDate,
                        Category = p.Category,
                        Tags = p.Tags,
                        TotalRows = totalRow
                    })
                    .OrderBy(p => p.CreatedDate)
                    .OrderBy(p => p.UpdatedDate)
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetBlogPostByCategory method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetBlogPostByTag(BaseRequest<BlogPostByUrlRequest> request)
        {
            try
            {
                var query = _context.BlogPost.AsQueryable();

                if (!string.IsNullOrEmpty(request.Payload.Keywords))
                {
                    query = query
                    .Where(p => p.Title.Contains(request.Payload.Keywords));
                }

                var totalRow = await query.Where(p => p.IsPublic).CountAsync();

                return (await query
                    .Where(p => p.Tags.Where(t => t.Url.Equals(request.Payload.Url ) ).Count() > 0)
                    .Include(p => p.Category)
                    .Include(p => p.Tags)
                    .AsNoTracking()
                    .Where(p => p.IsPublic)
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription,
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        UpdatedDate = p.UpdatedDate,
                        CreatedDate = p.CreatedDate,
                        Category = p.Category,
                        Tags = p.Tags,
                        TotalRows = totalRow
                    })
                    .OrderBy(p => p.CreatedDate)
                    .OrderBy(p => p.UpdatedDate)
                    .GetPagingQueryable(request.MetaData)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetBlogPostByCategory method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }

        public async Task<(List<BlogPost>, ResultCode)> GetNewsPost()
        {
            try
            {
                return (await _context.BlogPost
                    .Include(p => p.Category)
                    .AsNoTracking()
                    .AsQueryable()
                    .Where(p => p.IsPublic)
                    .OrderByDescending(p => p.CreatedDate)
                    .Select(p => new BlogPost()
                    {
                        Title = p.Title,
                        Thumbnail = p.Thumbnail,
                        ShortDescription = p.ShortDescription,
                        Url = p.Url,
                        View = p.View,
                        Comment = p.Comment,
                        Category = p.Category,
                        CreatedDate = p.CreatedDate
                    })  
                    .Take(3)
                    .ToListAsync(), ResultCode.Success);

            }
            catch (Exception ex)
            {
                _logger.LogError("Error at GetNewsPost method: " + ex.Message);
                return (null, ResultCode.Error);
            }
        }
    }
}

