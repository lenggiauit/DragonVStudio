using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request.AdminGame;
using DragonVStudio.API.Domain.Services.Communication.Response;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class AdminGameServerService : IAdminGameServerService
    {
        private readonly IAdminGameServerRepository _adminGameServerRepository;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<AdminGameServerService> _logger;

        public AdminGameServerService(IAdminGameServerRepository adminGameRepository, IEmailService emailService,
            ILogger<AdminGameServerService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _adminGameServerRepository = adminGameRepository;
            _emailService = emailService;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

        public async Task<(GameServer, ResultCode)> GetGameInfor(BaseGameRequest<GameServerInforRequest> baseGameRequest)
        {
            return await _adminGameServerRepository.GetGameInfor(baseGameRequest);
        }
    }
}
