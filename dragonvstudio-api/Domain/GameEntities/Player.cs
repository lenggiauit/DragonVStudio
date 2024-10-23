using DragonVStudio.API.Domain.Entities;
using DragonVStudio.API.Resources.Game;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DragonVStudio.API.Domain.GameEntities
{
    public class Player
    {
        [Key]
        public int Id { get; set; }

        [MaxLength(255)]
        public string PlayerId { get; set; }

        [MaxLength(255)]
        public string DiscordId { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        public int Money { get; set; }  

        public int BankAmount {  get; set; }

        [MaxLength(255)]
        public string Horse { get; set; }

        [MaxLength(255)]
        public string HorseHarness { get; set; }

        [MaxLength(255)]
        public string Equipment_0 { get; set; }

        [MaxLength(255)]
        public string Equipment_1 { get; set; }

        [MaxLength(255)]
        public string Equipment_2 { get; set; }

        [MaxLength(255)]
        public string Equipment_3 { get; set; }

        [MaxLength(255)]
        public string Armor_Head { get; set; }


        [MaxLength(255)]
        public string Armor_Body { get; set; }


        [MaxLength(255)]
        public string Armor_Leg { get; set; }


        [MaxLength(255)]
        public string Armor_Gloves { get; set; }


        [MaxLength(255)]
        public string Armor_Cape { get; set; }

        [MaxLength(255)]
        public string Class { get; set; }

        [MaxLength(255)]
        public string CustomName { get; set; } 
        
        public int FactionIndex { get; set; }
        public float PosX { get; set; }
        public float PosY { get; set; }
        public float PosZ { get; set; }

        [NotMapped]
        public virtual Faction Faction {  get; set; }

        [NotMapped]
        public Guid UserId { get; set; }
        [NotMapped]
        public UserGameItems[] Items { get; set; }
    }
}
