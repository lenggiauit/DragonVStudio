using AutoMapper;
using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.GameEntities;
using DragonVStudio.API.Domain.Models;
using DragonVStudio.API.Resources;
using DragonVStudio.API.Resources.Game;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        { 
            CreateMap<User, UserResource>();
            CreateMap<User, UserListResource>(); 
            CreateMap<Role, RoleResource>();
            CreateMap<Permission, PermissionResource>();
            
            // Ref
            CreateMap<RefModel, RefResource>(); 
            CreateMap<Conversation,ConversationResource>();
            CreateMap<User, ConversationerResource>();
            CreateMap<ConversationMessage, ConversationMessageResource>(); 
            
            CreateMap<Language, LanguageResource>();
            //
            CreateMap<Category, CategoryResource>();
            CreateMap<Tag, TagResource>();
            CreateMap<BlogPost, BlogPostResource>();
            CreateMap<Comment, CommentResource>();
            CreateMap<YoutubeVideo, YoutubeVideoResource>(); 
            CreateMap<Notification, NotificationResource>(); 
            //
            CreateMap<FileSharing, FileSharingResource > ();
            CreateMap<Feedback, FeedbackListResource>();

            // Game
            CreateMap<Faction, FactionResource>();  
            CreateMap<Player, PlayerResource>();  
            CreateMap<Player, PlayerEventResource>();
            CreateMap<Log, LogResource>(); 
            CreateMap<GameServer, GameServerResource>();
            CreateMap<GameServerList, GameServerListResource>();
            CreateMap<BattleEventPlayer, PlayerEventResource>();
            CreateMap<BannedPlayer, BannedPlayerResource>();
            CreateMap<GameItem, GameItemResource>();
            CreateMap<Player, PlayerHasItemsResource>();
            CreateMap<UserGameItems, UserGameItemsResource>(); 
            CreateMap<GachaItem, GachaItemsResource>();

            CreateMap<PersonalProperties, PersonalPropertyResource>();
            

        }
    }
}