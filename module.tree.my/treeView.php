<?php

$treeData = array(
	"Category1" => array(
		"Category1-1" => array(
			"Category1-1-1" => array(),
			"Category1-1-2" => array()
		),
		"Category1-2" => array(
			"Category1-2-1" => array(),
			"Category1-2-2" => array()
		)
	),
	"Category2" => array(
		"Category2-1" => array(
			"Category2-1-1" => array(),
			"Category2-1-2" => array()
		),
		"Category2-2" => array(
			"Category2-2-1" => array(
				"Category2-2-1-1" => array(),
				"Category2-2-1-2" => array()
			),
			"Category2-2-2" => array()
		)
	),
	"Category3" => array(
		"Category3-1" => array(
			"Category3-1-1" => array(),
			"Category3-1-2" => array()
		),
		"Category3-2" => array(
			"Category3-2-1" => array(
				"Category3-2-1-1" => array(),
				"Category3-2-1-2" => array()
			),
			"Category3-2-2" => array()
		)
	)
);

function buildTree($treeData, $isFirstLevel = false)
{
	$html = "<ul class='tree-node-children'>";

	foreach ($treeData as $key => $value)
	{
		$html .= "<li class='tree-node-header'>";

		if ($isFirstLevel)
			$html .= "<div class='tree-node' style='background-color: #6CD46C; color: #FFFFFF'>$key</div>";
		else
			$html .= "<div class='tree-node-header' style='background-color: #6CD46C; color: #FFFFFF'>$key</div>";


		if (!empty($value))
		{
			$html .= "<div class='tree-node-square' style='background-color: #479047'></div>";
			$html .= buildTree($value, true);
		}

		$html .= "</li>";
	}

	$html .= "</ul>";

	return $html;
}

echo buildTree($treeData);
