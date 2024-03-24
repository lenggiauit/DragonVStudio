using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using DragonVStudio.API.Domain.Helpers;
using DragonVStudio.API.Domain.Models;
using DragonVStudio.API.Domain.Repositories;
using DragonVStudio.API.Domain.Services;
using DragonVStudio.API.Domain.Services.Communication.Request;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DragonVStudio.API.Services
{
    public class RefService : IRefService
    {
        private readonly IRefRepository _iRefRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly AppSettings _appSettings;
        private readonly ILogger<RefService> _logger;

        public RefService(IRefRepository iRefRepository, ILogger<RefService> logger, IUnitOfWork unitOfWork, IOptions<AppSettings> appSettings)
        {
            _iRefRepository = iRefRepository;
            _logger = logger;
            _unitOfWork = unitOfWork;
            _appSettings = appSettings.Value;
        }

         
         
    }
}
