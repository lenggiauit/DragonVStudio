using DragonVStudio_API;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore;
using Microsoft.Extensions.Logging; 
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System;
using TaleWorlds.MountAndBlade;
using TaleWorlds.MountAndBlade.ListedServer;
using Microsoft.Extensions.Hosting;
using DragonVStudio.API.Domain.Entities;
using Microsoft.Extensions.DependencyInjection;

namespace DragonVStudio.API
{
    public class DragonVStudioAPISubModule: MBSubModuleBase
    {
        public static DragonVStudioAPISubModule Instance { get; set; }
        private IWebHost _webHost;

        protected override void OnSubModuleLoad()
        {
            DragonVStudioAPISubModule.Instance = this;
            base.OnSubModuleLoad();
            InitialListedGameServerState.OnActivated += this.DedicatedCustomGameServerStateActivated;

        }

        private void DedicatedCustomGameServerStateActivated()
        { 
            if (Module.CurrentModule == null)
            {
                Console.WriteLine("Web panel can't be activated! No modules loaded.");
                return;
            }


            IWebHostBuilder webHostBuilder = WebHost.CreateDefaultBuilder().ConfigureLogging(delegate (ILoggingBuilder logging)
            {
                logging.ClearProviders();
            }).UseStartup<Startup>();

            DefaultInterpolatedStringHandler defaultInterpolatedStringHandler = new DefaultInterpolatedStringHandler(9, 1);
            defaultInterpolatedStringHandler.AppendLiteral("http://*:");
            defaultInterpolatedStringHandler.AppendFormatted<int>(433);
            Console.ForegroundColor = ConsoleColor.Red;
            string[] array = new string[1];
            array[0] = defaultInterpolatedStringHandler.ToStringAndClear();
            _webHost = webHostBuilder.UseUrls(array).Build();
            defaultInterpolatedStringHandler = new DefaultInterpolatedStringHandler(51, 1);
            defaultInterpolatedStringHandler.AppendLiteral("Dragon V Studio API is live at port ");
            defaultInterpolatedStringHandler.AppendFormatted<int>(433);
            defaultInterpolatedStringHandler.AppendLiteral("!");
             
            using (var scope = _webHost.Services.CreateScope())
            using (var context = scope.ServiceProvider.GetService<DragonVContext>())
            {
                try
                {
                    context.Database.EnsureCreated();
                    //context.Database.Migrate();
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }

            Task.Run(delegate
            {
                this._webHost.Run();
            });
             
        }

        public static IHostBuilder CreateHostBuilder() =>
            Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });

        protected override void OnSubModuleUnloaded()
        {
            base.OnSubModuleUnloaded();
            InitialListedGameServerState.OnActivated -= this.DedicatedCustomGameServerStateActivated;
        }

    }
}
