using System;
using System.ComponentModel.DataAnnotations;

namespace DragonVStudio.API.Domain.Entities
{
    public class BattleEventPlayer: BaseEntity
    {
        [MaxLength(250)]
        public string GameUrl { get; set; }
        [MaxLength(250)]
        public string PlayerId { get; set; }
        [MaxLength(250)]
        public string DiscordId { get; set; }
        [MaxLength(250)]
        public string Name { get; set; }
        [MaxLength(250)]
        public string Class { get; set; }
        public int Team { get; set; }
        [MaxLength(250)]
        public string PreviousClass { get; set; }
        public int PreviousFactionIndex { get; set; }
        [MaxLength(255)]
        public string PreviousHorse { get; set; } 

        [MaxLength(255)]
        public string PreviousEquipment_0 { get; set; }

        [MaxLength(255)]
        public string PreviousEquipment_1 { get; set; }

        [MaxLength(255)]
        public string PreviousEquipment_2 { get; set; }

        [MaxLength(255)]
        public string PreviousEquipment_3 { get; set; }

        [MaxLength(255)]
        public string PreviousArmor_Head { get; set; } 

        [MaxLength(255)]
        public string PreviousArmor_Body { get; set; } 

        [MaxLength(255)]
        public string PreviousArmor_Leg { get; set; } 

        [MaxLength(255)]
        public string PreviousArmor_Gloves { get; set; } 

        [MaxLength(255)]
        public string PreviousArmor_Cape { get; set; }
    }
}
